from pathlib import Path
from urllib.parse import urlparse
from dotenv import load_dotenv
import json
import os
import subprocess
import tempfile
import urllib.error
import urllib.request

load_dotenv()

GITHUB_API_BASE = "https://api.github.com"


def parse_github_url(repo_url: str):
    """Extract owner and repository name from a GitHub URL."""

    parsed = urlparse(repo_url)

    if parsed.netloc.lower() not in [
        "github.com",
        "www.github.com"
    ]:
        raise ValueError(
            "Only GitHub repository URLs are supported."
        )

    parts = parsed.path.strip("/").split("/")

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
        "repo": repo
    }


def clone_repository(repo_url: str):
    """
    Clone a GitHub repository into a temporary directory.
    """

    repository = parse_github_url(repo_url)

    temp_directory = tempfile.mkdtemp(
        prefix="codearchaeologist_"
    )
    result = subprocess.run(
    [
        "git",
        "-c",
        "credential.helper=manager",
        "clone",
        "--depth",
        "100",
        repo_url,
        temp_directory
    ],
    capture_output=True,
    text=True
)
    if result.returncode != 0:
        raise RuntimeError(
            f"Failed to clone repository: {result.stderr}"
        )

    return {
        "owner": repository["owner"],
        "repo": repository["repo"],
        "path": temp_directory
    }


# ============================================================
# GitHub API
# ============================================================

def github_api_request(
    endpoint: str,
    params: dict | None = None
):
    """
    Make a request to the GitHub REST API.

    A GITHUB_TOKEN can be supplied through the environment.
    Public repositories can also be accessed without a token,
    subject to GitHub API rate limits.
    """

    token = os.getenv("GITHUB_TOKEN")

    url = f"{GITHUB_API_BASE}{endpoint}"

    if params:
        query = "&".join(
            f"{key}={value}"
            for key, value in params.items()
        )

        url = f"{url}?{query}"

    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "CodeArchaeologist"
    }

    if token:
        headers["Authorization"] = f"Bearer {token}"

    request = urllib.request.Request(
        url,
        headers=headers,
        method="GET"
    )

    try:

        with urllib.request.urlopen(
            request,
            timeout=20
        ) as response:

            data = response.read().decode(
                "utf-8"
            )

            return json.loads(data)

    except urllib.error.HTTPError as error:

        error_body = error.read().decode(
            "utf-8",
            errors="replace"
        )

        raise RuntimeError(
            f"GitHub API request failed "
            f"({error.code}): {error_body}"
        )

    except urllib.error.URLError as error:

        raise RuntimeError(
            f"GitHub API connection failed: {error}"
        )


def get_repository_pull_requests(
    owner: str,
    repo: str,
    state: str = "all",
    per_page: int = 30
):
    """
    Fetch pull requests for a repository.
    """

    return github_api_request(
        f"/repos/{owner}/{repo}/pulls",
        {
            "state": state,
            "per_page": per_page
        }
    )


def get_pull_request(
    owner: str,
    repo: str,
    pull_number: int
):
    """
    Fetch detailed information about a pull request.
    """

    return github_api_request(
        f"/repos/{owner}/{repo}/pulls/{pull_number}"
    )


def get_pull_request_comments(
    owner: str,
    repo: str,
    pull_number: int,
    per_page: int = 100
):
    """
    Fetch review comments attached to a pull request.
    """

    return github_api_request(
        f"/repos/{owner}/{repo}/pulls/{pull_number}/comments",
        {
            "per_page": per_page
        }
    )


def get_pull_request_reviews(
    owner: str,
    repo: str,
    pull_number: int,
    per_page: int = 100
):
    """
    Fetch pull request reviews.
    """

    return github_api_request(
        f"/repos/{owner}/{repo}/pulls/{pull_number}/reviews",
        {
            "per_page": per_page
        }
    )


def get_issue(
    owner: str,
    repo: str,
    issue_number: int
):
    """
    Fetch a GitHub issue.
    """

    return github_api_request(
        f"/repos/{owner}/{repo}/issues/{issue_number}"
    )


def get_issue_comments(
    owner: str,
    repo: str,
    issue_number: int,
    per_page: int = 100
):
    """
    Fetch comments belonging to a GitHub issue.
    """

    return github_api_request(
        f"/repos/{owner}/{repo}/issues/{issue_number}/comments",
        {
            "per_page": per_page
        }
    )


def get_commit_pull_requests(
    owner: str,
    repo: str,
    commit_hash: str
):
    """
    Find pull requests associated with a specific commit.
    """

    return github_api_request(
        f"/repos/{owner}/{repo}/commits/{commit_hash}/pulls"
    )


def extract_issue_numbers_from_text(
    text: str | None
):
    """
    Extract simple GitHub issue references such as:

        #123
        owner/repo#123

    from PR descriptions or comments.

    This is evidence discovery, not proof that an issue
    is formally linked to the change.
    """

    import re

    if not text:
        return []

    matches = re.findall(
        r"(?<!\w)#(\d+)",
        text
    )

    return sorted(
        set(
            int(number)
            for number in matches
        )
    )


def investigate_github_history(
    owner: str,
    repo: str,
    commit_hash: str
):
    """
    Gather GitHub collaboration evidence for a commit.

    Flow:

        Commit
          ↓
        Pull Requests
          ↓
        PR details
          ↓
        PR comments/reviews
          ↓
        Issue references
          ↓
        Issue details/comments
    """

    pull_requests = get_commit_pull_requests(
        owner,
        repo,
        commit_hash
    )

    investigations = []

    for pull_request in pull_requests:

        pull_number = pull_request.get(
            "number"
        )

        if not pull_number:
            continue

        details = get_pull_request(
            owner,
            repo,
            pull_number
        )

        comments = get_pull_request_comments(
            owner,
            repo,
            pull_number
        )

        reviews = get_pull_request_reviews(
            owner,
            repo,
            pull_number
        )

        issue_numbers = (
            extract_issue_numbers_from_text(
                details.get("body")
            )
        )

        issues = []

        for issue_number in issue_numbers:

            try:

                issue = get_issue(
                    owner,
                    repo,
                    issue_number
                )

                issue_comments = (
                    get_issue_comments(
                        owner,
                        repo,
                        issue_number
                    )
                )

                issues.append(
                    {
                        "issue": issue,
                        "comments": issue_comments
                    }
                )

            except RuntimeError:

                issues.append(
                    {
                        "issue_number": issue_number,
                        "status": "unavailable"
                    }
                )

        investigations.append(
            {
                "pull_request": details,
                "comments": comments,
                "reviews": reviews,
                "referenced_issues": issues
            }
        )

    return {
        "commit": commit_hash,
        "pull_requests": investigations,
        "total_pull_requests": len(
            investigations
        )
    }