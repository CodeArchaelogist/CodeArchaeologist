from app.services.git_analyzer import (
    get_commit_history,
    get_changed_files,
    run_git_command
)
from app.services.git_diff_analyzer import get_commit_diff


class HistoryAgent:
    """
    History Agent responsible for understanding
    how repository code evolved over time.
    """

    name = "history_agent"

    def investigate(
        self,
        repo_path: str,
        commit_hash: str | None = None,
        history_limit: int = 20
    ):
        """
        Analyze repository history and, when provided,
        investigate a specific commit.
        """

        if not repo_path:
            raise ValueError("Repository path is required.")

        commits = get_commit_history(
            repo_path,
            limit=history_limit
        )

        result = {
            "agent": self.name,
            "status": "success",
            "commits": commits,
            "total_commits": len(commits)
        }

        if commit_hash:
            result["target_commit"] = commit_hash

            result["changed_files"] = get_changed_files(
                repo_path,
                commit_hash
            )

            result["commit_diff"] = get_commit_diff(
                repo_path,
                commit_hash
            )

            result["blame"] = self.get_blame(
                repo_path,
                result["changed_files"]
            )

        return result

    def get_blame(
        self,
        repo_path: str,
        changed_files: list[str]
    ):
        """
        Retrieve Git blame information for changed files.

        Blame is used as historical evidence showing
        which commit last modified each relevant line.
        """

        blame_evidence = {}

        for file_path in changed_files:

            try:
                output = run_git_command(
                    repo_path,
                    [
                        "blame",
                        "--line-porcelain",
                        "--",
                        file_path
                    ]
                )

                blame_evidence[file_path] = output

            except RuntimeError:
                blame_evidence[file_path] = {
                    "status": "unavailable",
                    "reason": "Git blame could not be retrieved."
                }

        return blame_evidence