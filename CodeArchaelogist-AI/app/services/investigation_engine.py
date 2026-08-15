import json
import os

from dotenv import load_dotenv
from groq import Groq


load_dotenv()


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
        "code": [],
        "dependencies": {},
        "impact": {}
    }

    # -----------------------------
    # Git history
    # -----------------------------

    history = evidence.get("history", {})

    if isinstance(history, dict):
        commits = history.get("commits", [])

        compact["history"] = {
            "commits": commits[:10],
            "total_commits_returned": history.get(
                "total_commits_returned",
                len(commits)
            )
        }

    # -----------------------------
    # Commit diff
    # -----------------------------

    commit_diff = evidence.get("commit_diff", {})

    if isinstance(commit_diff, dict):
        compact["commit_diff"] = commit_diff
    else:
        compact["commit_diff"] = str(commit_diff)

    # -----------------------------
    # Code analysis
    # -----------------------------

    code_analysis = evidence.get("code", [])

    if isinstance(code_analysis, dict):
        code_analysis = code_analysis.get("files", [])

    if isinstance(code_analysis, list):
        compact["code"] = code_analysis[:10]

    # -----------------------------
    # Dependency analysis
    # -----------------------------

    dependencies = evidence.get("dependencies", {})

    if isinstance(dependencies, dict):
        compact["dependencies"] = dict(
            list(dependencies.items())[:20]
        )
    else:
        compact["dependencies"] = dependencies

    # -----------------------------
    # Impact analysis
    # -----------------------------

    impact = evidence.get("impact", {})

    if isinstance(impact, dict):
        compact["impact"] = dict(
            list(impact.items())[:20]
        )
    else:
        compact["impact"] = impact

    # -----------------------------
    # Convert to JSON
    # -----------------------------

    serialized = json.dumps(
        compact,
        default=str,
        indent=2
    )

    # Safety limit
    if len(serialized) > max_chars:
        serialized = serialized[:max_chars]

    return serialized


def investigate_evidence(evidence: dict, question: str):
    """
    Use repository evidence to answer an engineering
    investigation question.
    """

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise RuntimeError(
            "GROQ_API_KEY is not configured"
        )

    client = Groq(api_key=api_key)

    # Compact the repository evidence before
    # sending it to the LLM.
    compact_context = compact_evidence(evidence)

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
4. If the evidence is insufficient, explicitly say so.
5. Use commit hashes, commit messages, changed files,
   dependencies, impact relationships, and diffs whenever
   they are available.
6. Keep the investigation technical and concise.

USER QUESTION:
{question}

REPOSITORY EVIDENCE:
{compact_context}

Provide the investigation using exactly these sections:

1. Historical Intent
Explain what the available evidence suggests about why
the change or code exists.

2. Evidence
List the specific evidence supporting the explanation.
Mention relevant commit hashes, commit messages,
changed files, dependencies, or diff information.

3. Impact
Explain which parts of the repository may be affected
by the change.

4. Risk
Explain the potential risks of changing or removing
the relevant code.

5. Confidence
Return exactly one:
High
Medium
Low

6. Uncertainty
Clearly explain what cannot be established from the
available evidence.

Do not invent information that is not present in the evidence.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.1,
    )

    return response.choices[0].message.content