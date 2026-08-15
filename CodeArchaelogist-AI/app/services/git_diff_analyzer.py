import re
import subprocess


def get_commit_diff(repo_path: str, commit_hash: str):
    """
    Get the actual code changes and changed files
    for a specific Git commit.
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

        diff_text = result.stdout

        changed_files = re.findall(
            r"^\+\+\+ b/(.+)$",
            diff_text,
            re.MULTILINE
        )

        return {
            "status": "success",
            "commit": commit_hash,
            "changed_files": sorted(set(changed_files)),
            "diff": diff_text
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }