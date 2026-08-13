import subprocess


def get_commit_diff(repo_path: str, commit_hash: str):
    """
    Get the actual code changes for a specific Git commit.
    """

    if not repo_path or not commit_hash:
        return {
            "status": "error",
            "message": "Repository path and commit hash are required."
        }

    try:
        result = subprocess.run(
            [
                "git",
                "show",
                "--stat",
                "--patch",
                "--format=fuller",
                commit_hash
            ],
            cwd=repo_path,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace"
        )

        if result.returncode != 0:
            return {
                "status": "error",
                "message": result.stderr.strip()
            }

        return {
            "status": "success",
            "commit": commit_hash,
            "diff": result.stdout
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }