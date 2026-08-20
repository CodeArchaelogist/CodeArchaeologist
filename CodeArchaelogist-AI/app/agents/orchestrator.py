from app.agents.issue_pr_agent import IssuePRAgent
from app.services.code_analyzer import analyze_repository_code
from app.services.dependency_analyzer import build_dependency_graph
from app.services.impact_analyzer import build_reverse_dependency_graph
from app.services.git_analyzer import get_commit_history
from app.services.git_diff_analyzer import get_commit_diff
from app.services.evidence_builder import build_investigation_evidence
from app.services.investigation_engine import investigate_evidence


class InvestigationOrchestrator:
    """
    Coordinates the different repository investigation components.

    Flow:

        User Question
              ↓
        Orchestrator
              ↓
        Code Analysis
        Git History
        Commit Diff
        Dependency Analysis
        Impact Analysis
        Issue / PR Analysis
              ↓
        Evidence Builder
              ↓
        Reasoning Engine
              ↓
        Final Investigation
    """

    def __init__(self):
        self.issue_pr_agent = IssuePRAgent()

    def investigate(
        self,
        repository,
        commit_hash,
        question
    ):
        """
        Run a complete commit investigation.
        """

        repo_path = repository["path"]
        owner = repository["owner"]
        repo = repository["repo"]

        # --------------------------------------------------
        # 1. Code Agent
        # --------------------------------------------------

        code_analysis = analyze_repository_code(
            repo_path
        )

        # --------------------------------------------------
        # 2. Dependency Agent
        # --------------------------------------------------

        dependency_graph = build_dependency_graph(
            code_analysis,
            repo_path
        )

        # --------------------------------------------------
        # 3. Impact Analysis
        # --------------------------------------------------

        impact_graph = build_reverse_dependency_graph(
            dependency_graph
        )

        # --------------------------------------------------
        # 4. History Agent
        # --------------------------------------------------

        commits = get_commit_history(
            repo_path,
            limit=20
        )

        # --------------------------------------------------
        # 5. Commit Diff Analysis
        # --------------------------------------------------

        diff = get_commit_diff(
            repo_path,
            commit_hash
        )

        if diff.get("status") == "error":
            raise ValueError(
                diff.get(
                    "message",
                    "Failed to analyze commit"
                )
            )

        changed_files = diff.get(
            "changed_files",
            []
        )

        # --------------------------------------------------
        # 6. Filter code evidence to changed files
        # --------------------------------------------------

        relevant_code_analysis = [
            file_data
            for file_data in code_analysis
            if any(
                file_data.get(
                    "file",
                    ""
                ).replace("\\", "/").endswith(
                    changed_file.replace("\\", "/")
                )
                for changed_file in changed_files
            )
        ]

        # --------------------------------------------------
        # 7. Relevant dependency evidence
        # --------------------------------------------------

        relevant_dependencies = [
            item
            for item in dependency_graph
            if item.get("file") in changed_files
        ]

        # --------------------------------------------------
        # 8. Relevant impact evidence
        # --------------------------------------------------

        relevant_impact = {}

        for changed_file in changed_files:

            if changed_file in impact_graph:
                relevant_impact[changed_file] = (
                    impact_graph[changed_file]
                )

        # --------------------------------------------------
        # 9. Issue / PR Agent
        # --------------------------------------------------

        github_history = (
            self.issue_pr_agent.investigate(
                owner,
                repo,
                commit_hash
            )
        )

        # --------------------------------------------------
        # 10. Build unified evidence
        # --------------------------------------------------

        evidence = build_investigation_evidence(
            code_analysis={
                "files": relevant_code_analysis,
                "total_files_analyzed": len(
                    relevant_code_analysis
                )
            },

            dependencies=relevant_dependencies,

            impact_analysis=relevant_impact,

            history={
                "target_commit": commit_hash,
                "commits": commits,
                "total_commits_returned": len(
                    commits
                )
            },

            commit_diff=diff,

            github_history=github_history
        )

        # --------------------------------------------------
        # 11. Reasoning Agent
        # --------------------------------------------------

        investigation = investigate_evidence(
            evidence=evidence,
            question=question
        )

        # --------------------------------------------------
        # 12. Final structured result
        # --------------------------------------------------

        return {
            "status": "success",

            "repository": {
                "owner": owner,
                "name": repo
            },

            "commit": {
                "hash": commit_hash,
                "changed_files": changed_files
            },

            "evidence": evidence,

            "investigation": investigation
        }