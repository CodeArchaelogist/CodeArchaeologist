from pathlib import Path
from urllib.parse import urlparse, urlencode
from dotenv import load_dotenv
import json
import os
import re
import subprocess
import tempfile
import time
import urllib.error
import urllib.request


# ============================================================
# ENVIRONMENT
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_FILE)


GITHUB_API_BASE = "https://api.github.com"

GITHUB_TIMEOUT = int(
    os.getenv("GITHUB_API_TIMEOUT", "30")
)

GITHUB_RETRIES = int(
    os.getenv("GITHUB_API_RETRIES", "2")
)


# ============================================================
# GITHUB URL PARSING
# ============================================================

def parse_github_url(repo_url: str):
    """
    Extract owner and repository name from a GitHub URL.
    """

    if not repo_url:
        raise ValueError(
            "GitHub repository URL is required."
        )

    parsed = urlparse(repo_url.strip())

    if parsed.netloc.lower() not in {
        "github.com",
        "www.github.com",
    }:
        raise ValueError(
            "Only GitHub repository URLs are supported."
        )

    parts = [
        part
        for part in parsed.path.strip("/").split("/")
        if part
    ]

    if len(parts) < 2:
        raise ValueError(
            "Invalid GitHub repository URL."
        )

    owner = parts[0]
    repo = parts[1]

    if repo.endswith(".git"):
        repo = repo[:-4]

    return {
        "owner": owner,
        "repo": repo,
    }


# ============================================================
# REPOSITORY CLONING
# ============================================================

def clone_repository(repo_url: str):
    """
    Clone a GitHub repository into a temporary directory.

    This uses git directly and does not depend on the
    GitHub REST API.
    """

    repository = parse_github_url(repo_url)

    temp_directory = tempfile.mkdtemp(
        prefix="codearchaeologist_"
    )

    try:

        result = subprocess.run(
            [
                "git",
                "-c",
                "credential.helper=manager",
                "clone",
                "--depth",
                "100",
                repo_url,
                temp_directory,
            ],
            capture_output=True,
            text=True,
            timeout=180,
        )

    except subprocess.TimeoutExpired:

        raise RuntimeError(
            "GitHub repository cloning timed out."
        )

    if result.returncode != 0:

        stderr = (
            result.stderr.strip()
            or "Unknown git clone error."
        )

        raise RuntimeError(
            f"Failed to clone repository: {stderr}"
        )

    return {
        "owner": repository["owner"],
        "repo": repository["repo"],
        "path": temp_directory,
    }


# ============================================================
# GITHUB API
# ============================================================

def github_api_request(
    endpoint: str,
    params: dict | None = None,
):
    """
    Make a request to the GitHub REST API.

    Public repositories can be accessed without a token,
    but supplying GITHUB_TOKEN is strongly recommended because
    unauthenticated GitHub API requests have stricter rate limits.
    """

    token = os.getenv("GITHUB_TOKEN")

    url = f"{GITHUB_API_BASE}{endpoint}"

    if params:

        clean_params = {
            key: value
            for key, value in params.items()
            if value is not None
        }

        if clean_params:

            url = (
                f"{url}?"
                f"{urlencode(clean_params)}"
            )

    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "CodeArchaeologist-AI",
    }

    if token:

        headers["Authorization"] = (
            f"Bearer {token}"
        )

    request = urllib.request.Request(
        url,
        headers=headers,
        method="GET",
    )

    last_error = None

    for attempt in range(
        GITHUB_RETRIES + 1
    ):

        try:

            with urllib.request.urlopen(
                request,
                timeout=GITHUB_TIMEOUT,
            ) as response:

                data = response.read().decode(
                    "utf-8"
                )

                return json.loads(data)

        except urllib.error.HTTPError as error:

            error_body = error.read().decode(
                "utf-8",
                errors="replace",
            )

            last_error = (
                f"GitHub API request failed "
                f"({error.code}): {error_body}"
            )

            # Retry only transient server errors.
            if error.code in {
                502,
                503,
                504,
            } and attempt < GITHUB_RETRIES:

                time.sleep(
                    1.5 * (attempt + 1)
                )

                continue

            raise RuntimeError(
                last_error
            )

        except urllib.error.URLError as error:

            last_error = (
                f"GitHub API connection failed: "
                f"{error}"
            )

            if attempt < GITHUB_RETRIES:

                time.sleep(
                    1.5 * (attempt + 1)
                )

                continue

            raise RuntimeError(
                last_error
            )

        except TimeoutError:

            last_error = (
                "GitHub API request timed out."
            )

            if attempt < GITHUB_RETRIES:

                time.sleep(
                    1.5 * (attempt + 1)
                )

                continue

            raise RuntimeError(
                last_error
            )

        except json.JSONDecodeError:

            raise RuntimeError(
                "GitHub API returned invalid JSON."
            )

    raise RuntimeError(
        last_error
        or "GitHub API request failed."
    )


# ============================================================
# PULL REQUESTS
# ============================================================

def get_repository_pull_requests(
    owner: str,
    repo: str,
    state: str = "all",
    per_page: int = 30,
):

    return github_api_request(
        f"/repos/{owner}/{repo}/pulls",
        {
            "state": state,
            "per_page": per_page,
        },
    )


def get_pull_request(
    owner: str,
    repo: str,
    pull_number: int,
):

    return github_api_request(
        f"/repos/{owner}/{repo}/pulls/{pull_number}"
    )


def get_pull_request_comments(
    owner: str,
    repo: str,
    pull_number: int,
    per_page: int = 100,
):

    return github_api_request(
        f"/repos/{owner}/{repo}/pulls/"
        f"{pull_number}/comments",
        {
            "per_page": per_page,
        },
    )


def get_pull_request_reviews(
    owner: str,
    repo: str,
    pull_number: int,
    per_page: int = 100,
):

    return github_api_request(
        f"/repos/{owner}/{repo}/pulls/"
        f"{pull_number}/reviews",
        {
            "per_page": per_page,
        },
    )


# ============================================================
# ISSUES
# ============================================================

def get_issue(
    owner: str,
    repo: str,
    issue_number: int,
):

    return github_api_request(
        f"/repos/{owner}/{repo}/issues/"
        f"{issue_number}"
    )


def get_issue_comments(
    owner: str,
    repo: str,
    issue_number: int,
    per_page: int = 100,
):

    return github_api_request(
        f"/repos/{owner}/{repo}/issues/"
        f"{issue_number}/comments",
        {
            "per_page": per_page,
        },
    )


# ============================================================
# COMMIT → PULL REQUESTS
# ============================================================

def get_commit_pull_requests(
    owner: str,
    repo: str,
    commit_hash: str,
):

    return github_api_request(
        f"/repos/{owner}/{repo}/commits/"
        f"{commit_hash}/pulls"
    )


# ============================================================
# ISSUE EXTRACTION
# ============================================================

def extract_issue_numbers_from_text(
    text: str | None,
):

    if not text:
        return []

    matches = re.findall(
        r"(?<!\w)#(\d+)",
        text,
    )

    return sorted(
        set(
            int(number)
            for number in matches
        )
    )


# ============================================================
# GITHUB INVESTIGATION HISTORY
# ============================================================

def investigate_github_history(
    owner: str,
    repo: str,
    commit_hash: str,
):
    """
    Gather GitHub collaboration evidence associated
    with a specific commit.

    GitHub evidence is supplementary. A temporary GitHub
    API failure should not destroy the repository analysis.
    """

    try:

        pull_requests = get_commit_pull_requests(
            owner,
            repo,
            commit_hash,
        )

    except RuntimeError as error:

        return {
            "commit": commit_hash,
            "pull_requests": [],
            "total_pull_requests": 0,
            "status": "unavailable",
            "error": str(error),
        }

    investigations = []

    for pull_request in pull_requests:

        pull_number = pull_request.get(
            "number"
        )

        if not pull_number:
            continue

        try:

            details = get_pull_request(
                owner,
                repo,
                pull_number,
            )

            comments = get_pull_request_comments(
                owner,
                repo,
                pull_number,
            )

            reviews = get_pull_request_reviews(
                owner,
                repo,
                pull_number,
            )

        except RuntimeError as error:

            investigations.append(
                {
                    "pull_request": pull_request,
                    "details": None,
                    "comments": [],
                    "reviews": [],
                    "referenced_issues": [],
                    "status": "partial",
                    "error": str(error),
                }
            )

            continue

        issue_numbers = (
            extract_issue_numbers_from_text(
                details.get("body")
            )
        )

        issues = []

        # Limit issue traversal so one PR cannot
        # generate an excessive number of requests.
        for issue_number in issue_numbers[:5]:

            try:

                issue = get_issue(
                    owner,
                    repo,
                    issue_number,
                )

                issue_comments = (
                    get_issue_comments(
                        owner,
                        repo,
                        issue_number,
                    )
                )

                issues.append(
                    {
                        "issue": issue,
                        "comments": issue_comments,
                    }
                )

            except RuntimeError as error:

                issues.append(
                    {
                        "issue_number": issue_number,
                        "status": "unavailable",
                        "error": str(error),
                    }
                )

        investigations.append(
            {
                "pull_request": details,
                "comments": comments,
                "reviews": reviews,
                "referenced_issues": issues,
                "status": "complete",
            }
        )

    return {
        "commit": commit_hash,
        "pull_requests": investigations,
        "total_pull_requests": len(
            investigations
        ),
        "status": "complete",
    }