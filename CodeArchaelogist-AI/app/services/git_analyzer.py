import subprocess


def run_git_command(repo_path: str, arguments: list[str]):

    result = subprocess.run(
        ["git", "-C", repo_path] + arguments,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace"
    )

    if result.returncode != 0:
        raise RuntimeError(
            f"Git command failed: {result.stderr}"
        )

    return result.stdout.strip()


def get_commit_history(repo_path: str, limit: int = 20):

    output = run_git_command(
        repo_path,
        [
            "log",
            f"-{limit}",
            "--pretty=format:%H|%an|%ad|%s",
            "--date=iso"
        ]
    )

    if not output:
        return []

    commits = []

    for line in output.splitlines():

        parts = line.split("|", 3)

        if len(parts) != 4:
            continue

        commit_hash, author, date, message = parts

        changed_files = get_changed_files(
            repo_path,
            commit_hash
        )

        commits.append(
    {
        "hash": commit_hash,
        "author": author,
        "date": date,
        "message": message,
        "changed_files": changed_files
    }
)


    return commits


def get_changed_files(repo_path: str, commit_hash: str):

    output = run_git_command(
        repo_path,
        [
            "show",
            "--pretty=",
            "--name-only",
            commit_hash
        ]
    )

    files = []

    for line in output.splitlines():

        line = line.strip()

        if line:
            files.append(line)

    return files


def get_commit_diff(repo_path: str, commit_hash: str):

    output = run_git_command(
        repo_path,
        [
            "show",
            "--format=fuller",
            "--stat",
            "--patch",
            commit_hash
        ]
    )

    return output