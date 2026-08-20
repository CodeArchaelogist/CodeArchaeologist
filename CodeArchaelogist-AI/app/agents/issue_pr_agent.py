from app.services.github_service import (
    investigate_github_history
)


class IssuePRAgent:
    """
    Issue/PR Agent responsible for connecting
    code changes with GitHub pull requests,
    reviews, comments, and referenced issues.
    """

    name = "issue_pr_agent"

    def investigate(
        self,
        owner: str,
        repo: str,
        commit_hash: str
    ):
        """
        Investigate GitHub collaboration history
        associated with a commit.
        """

        if not owner:
            raise ValueError(
                "Repository owner is required."
            )

        if not repo:
            raise ValueError(
                "Repository name is required."
            )

        if not commit_hash:
            raise ValueError(
                "Commit hash is required."
            )

        evidence = investigate_github_history(
            owner=owner,
            repo=repo,
            commit_hash=commit_hash
        )

        return {
            "agent": self.name,
            "status": "success",
            "evidence": evidence
        }