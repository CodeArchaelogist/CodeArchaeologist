from pathlib import Path
from urllib.parse import urlparse
import subprocess
import tempfile


def parse_github_url(repo_url: str):
    """Extract owner and repository name from a GitHub URL."""

    parsed = urlparse(repo_url)

    if parsed.netloc.lower() not in ["github.com", "www.github.com"]:
        raise ValueError("Only GitHub repository URLs are supported.")

    parts = parsed.path.strip("/").split("/")

    if len(parts) < 2:
        raise ValueError("Invalid GitHub repository URL.")

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

    temp_directory = tempfile.mkdtemp(prefix="codearchaeologist_")

    result = subprocess.run(
        [
            "git",
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