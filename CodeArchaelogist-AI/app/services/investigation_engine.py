import json
import os
from pathlib import Path

from dotenv import load_dotenv
from groq import Groq


# ------------------------------------------------------------
# Load environment variables from the AI service directory
# ------------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_FILE)


def compact_evidence(evidence: dict, max_chars: int = 18000):
    """
    Reduce repository evidence before sending it to the LLM.

    The complete repository analysis can be very large.
    The LLM should receive only a compact representation
    of the available evidence.
    """

    compact = {
        "history": {},
        "commit_diff": {},
        "github_history": {},
        "code": [],
        "dependencies": [],
        "impact": {},
    }

    # --------------------------------------------------------
    # Git history
    # --------------------------------------------------------

    history = evidence.get("history", {})

    if isinstance(history, dict):
        commits = history.get("commits", [])

        compact["history"] = {
            "target_commit": history.get("target_commit"),
            "commits": commits[:10],
            "total_commits_returned": history.get(
                "total_commits_returned",
                len(commits),
            ),
        }

    # --------------------------------------------------------
    # Commit diff
    # --------------------------------------------------------

    commit_diff = evidence.get("commit_diff", {})

    if isinstance(commit_diff, dict):
        compact["commit_diff"] = commit_diff
    else:
        compact["commit_diff"] = str(commit_diff)

    # --------------------------------------------------------
    # GitHub collaboration history
    # --------------------------------------------------------

    github_history = evidence.get("github_history", {})

    if isinstance(github_history, dict):
        compact["github_history"] = {
            "commit": github_history.get("commit"),
            "total_pull_requests": github_history.get(
                "total_pull_requests",
                0,
            ),
            "pull_requests": github_history.get(
                "pull_requests",
                [],
            )[:5],
        }
    else:
        compact["github_history"] = github_history

    # --------------------------------------------------------
    # Code analysis
    # --------------------------------------------------------

    code_analysis = evidence.get("code", [])

    if isinstance(code_analysis, dict):
        code_analysis = code_analysis.get("files", [])

    if isinstance(code_analysis, list):
        compact["code"] = code_analysis[:10]

    # --------------------------------------------------------
    # Dependency analysis
    # --------------------------------------------------------

    dependencies = evidence.get("dependencies", [])

    if isinstance(dependencies, list):
        compact["dependencies"] = dependencies[:20]

    elif isinstance(dependencies, dict):
        compact["dependencies"] = dict(
            list(dependencies.items())[:20]
        )

    else:
        compact["dependencies"] = dependencies

    # --------------------------------------------------------
    # Impact analysis
    # --------------------------------------------------------

    impact = evidence.get("impact", {})

    if isinstance(impact, dict):
        compact["impact"] = dict(
            list(impact.items())[:20]
        )
    else:
        compact["impact"] = impact

    # --------------------------------------------------------
    # Convert evidence to JSON
    # --------------------------------------------------------

    serialized = json.dumps(
        compact,
        default=str,
        indent=2,
    )

    # --------------------------------------------------------
    # Safety limit
    # --------------------------------------------------------

    if len(serialized) > max_chars:
        serialized = serialized[:max_chars]

    return serialized


def investigate_evidence(
    evidence: dict,
    question: str,
):
    """
    Use repository evidence to perform
    an engineering investigation.
    """

    # --------------------------------------------------------
    # Load Groq API key
    # --------------------------------------------------------

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise RuntimeError(
            "GROQ_API_KEY is not configured in the "
            "CodeArchaelogist AI service environment."
        )

    # --------------------------------------------------------
    # Create Groq client
    # --------------------------------------------------------

    client = Groq(api_key=api_key)

    # --------------------------------------------------------
    # Compact repository evidence
    # --------------------------------------------------------

    compact_context = compact_evidence(evidence)

    # --------------------------------------------------------
    # Investigation prompt
    # --------------------------------------------------------

    prompt = f"""
You are CodeArchaeologist, an AI software archaeology assistant.

Your job is to investigate a software repository using ONLY
the repository evidence provided below.

IMPORTANT RULES:

1. Do not invent historical facts.

2. Do not claim that a developer intended something unless
the evidence supports that conclusion.

3. Clearly distinguish between:
   - facts directly supported by evidence
   - reasonable inferences
   - unknown information

4. If the evidence is insufficient, explicitly state that.

5. The target commit is the primary subject of this investigation.

6. Use the target commit hash, commit message, changed files,
dependencies, impact relationships, commit diff, and GitHub
collaboration evidence whenever available.

7. GitHub collaboration evidence may include pull requests,
PR descriptions, review comments, reviews, referenced issues,
and issue comments.

8. Treat GitHub PR/issue information as evidence only when it
directly relates to the target commit or the investigated change.

9. Do not use an unrelated commit as the primary explanation
when a target commit is explicitly provided.

10. Keep the investigation technical and evidence-based.

11. Assess risk using the available repository evidence.

12. Consider the following when assessing risk:
    - number of directly changed files
    - dependency relationships
    - reverse dependency relationships
    - whether core application files are affected
    - whether configuration or infrastructure files are affected

13. Do not assign a high risk simply because many files changed.
The risk level must be justified by repository evidence.

USER QUESTION:
{question}

REPOSITORY EVIDENCE:
{compact_context}

Return ONLY valid JSON.

Use exactly this structure:

{{
    "historical_intent": "Explain what the evidence suggests about why the change exists.",

    "evidence": [
        "Specific evidence supporting the explanation."
    ],

    "impact": [
        "Repository components or files that may be affected."
    ],

    "risk": {{
        "level": "Medium",
        "reasons": [
            "Potential risks of changing or removing the relevant code."
        ]
    }},

    "confidence": "Medium",

    "uncertainty": [
        "Information that cannot be established from the available evidence."
    ]
}}

Rules for the JSON:

- "historical_intent" must be a string.
- "evidence" must be an array of strings.
- "impact" must be an array of strings.
- "risk" must be an object.
- "risk.level" must be exactly one of:
  "Low", "Medium", or "High".
- "risk.reasons" must be an array of strings.
- "confidence" must be exactly one of:
  "High", "Medium", or "Low".
- "uncertainty" must be an array of strings.
- Do not add markdown.
- Do not add explanations outside the JSON.
- Do not invent evidence.
"""

    # --------------------------------------------------------
    # Call Groq
    # --------------------------------------------------------

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        temperature=0.1,
        response_format={
            "type": "json_object",
        },
    )

    content = response.choices[0].message.content

    # --------------------------------------------------------
    # Parse JSON
    # --------------------------------------------------------

    try:
        return json.loads(content)

    except json.JSONDecodeError:
        return {
            "historical_intent": content,
            "evidence": [],
            "impact": [],
            "risk": {
                "level": "Low",
                "reasons": [
                    "The model response could not be parsed "
                    "as structured JSON."
                ],
            },
            "confidence": "Low",
            "uncertainty": [
                "The model response could not be parsed "
                "as structured JSON."
            ],
        }