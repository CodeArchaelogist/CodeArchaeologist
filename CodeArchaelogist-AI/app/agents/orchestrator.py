from app.agents.code_agent import CodeAgent
from app.agents.dependency_agent import DependencyAgent
from app.agents.history_agent import HistoryAgent
from app.agents.issue_pr_agent import IssuePRAgent
from app.agents.rag_agent import RAGAgent

from app.services.evidence_builder import (
    build_investigation_evidence
)

from app.services.investigation_engine import (
    investigate_evidence
)


class InvestigationOrchestrator:
    """
    Coordinates the repository investigation agents.

    Flow:

        User Question
              ↓
        InvestigationOrchestrator
              ↓
        ┌───────────────┬────────────────┐
        ↓               ↓                ↓
    CodeAgent     DependencyAgent    HistoryAgent
        │               │                │
        └───────────────┴────────────────┘
                        ↓
                  IssuePRAgent
                        ↓
                     RAGAgent
                        ↓
                 Evidence Builder
                        ↓
                Investigation Engine
                        ↓
                 Final Investigation
    """

    name = "investigation_orchestrator"

    def __init__(self):

        self.code_agent = CodeAgent()

        self.dependency_agent = DependencyAgent()

        self.history_agent = HistoryAgent()

        self.issue_pr_agent = IssuePRAgent()

        self.rag_agent = RAGAgent()

    def investigate(
        self,
        repository,
        commit_hash,
        question
    ):
        """
        Run a complete multi-agent commit investigation.
        """

        if not repository:
            raise ValueError(
                "Repository information is required."
            )

        if not commit_hash:
            raise ValueError(
                "Commit hash is required."
            )

        if not question:
            raise ValueError(
                "Investigation question is required."
            )

        repo_path = repository.get("path")

        owner = repository.get("owner")

        repo = repository.get("repo")

        if not repo_path:
            raise ValueError(
                "Repository path is required."
            )

        if not owner or not repo:
            raise ValueError(
                "Repository owner and name are required."
            )

        # ==================================================
        # 1. Code Agent
        # ==================================================

        code_result = self.code_agent.investigate(
            repo_path
        )

        code_analysis = code_result.get(
            "files",
            []
        )

        # ==================================================
        # 2. Dependency Agent
        # ==================================================

        dependency_result = (
            self.dependency_agent.investigate(
                code_analysis,
                repo_path
            )
        )

        dependency_graph = (
            dependency_result.get(
                "dependencies",
                []
            )
        )

        impact_graph = (
            dependency_result.get(
                "impact",
                {}
            )
        )

        # ==================================================
        # 3. History Agent
        # ==================================================

        history_result = (
            self.history_agent.investigate(
                repo_path,
                commit_hash=commit_hash,
                history_limit=20
            )
        )

        commits = history_result.get(
            "commits",
            []
        )

        changed_files = history_result.get(
            "changed_files",
            []
        )

        diff = history_result.get(
            "commit_diff",
            {}
        )

        # ==================================================
        # 4. Validate commit diff
        # ==================================================

        if isinstance(diff, dict):

            if diff.get("status") == "error":

                raise ValueError(
                    diff.get(
                        "message",
                        "Failed to analyze commit."
                    )
                )

        # ==================================================
        # 5. Filter code evidence to changed files
        # ==================================================

        relevant_code_analysis = [

            file_data

            for file_data in code_analysis

            if any(

                file_data.get(
                    "file",
                    ""
                ).replace(
                    "\\",
                    "/"
                ).endswith(

                    changed_file.replace(
                        "\\",
                        "/"
                    )

                )

                for changed_file in changed_files
            )
        ]

        # ==================================================
        # 6. Filter dependency evidence
        # ==================================================

        relevant_dependencies = [

            item

            for item in dependency_graph

            if item.get("file") in changed_files
        ]

        # ==================================================
        # 7. Filter impact evidence
        # ==================================================

        relevant_impact = {}

        for changed_file in changed_files:

            if changed_file in impact_graph:

                relevant_impact[
                    changed_file
                ] = impact_graph[
                    changed_file
                ]

        # ==================================================
        # 8. Issue / PR Agent
        # ==================================================

        github_history = (
            self.issue_pr_agent.investigate(
                owner,
                repo,
                commit_hash
            )
        )

        # ==================================================
        # 9. RAG Agent
        # ==================================================

        rag_result = self.rag_agent.investigate(
            repo_path=repo_path,
            question=question,
            top_k=5
        )

        retrieved_evidence = rag_result.get(
            "retrieved_evidence",
            []
        )

        # ==================================================
        # 10. Build unified evidence
        # ==================================================

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
                "changed_files": changed_files,
                "total_commits_returned": len(
                    commits
                ),
                "blame": history_result.get(
                    "blame",
                    {}
                )
            },

            commit_diff=diff,

            github_history=github_history,

            rag_evidence=retrieved_evidence
        )

        # ==================================================
        # 11. Reasoning Agent / Investigation Engine
        # ==================================================

        investigation = investigate_evidence(
            evidence=evidence,
            question=question
        )

        # ==================================================
        # 12. Final structured result
        # ==================================================

        return {

            "status": "success",

            "agent": self.name,

            "repository": {
                "owner": owner,
                "name": repo
            },

            "commit": {
                "hash": commit_hash,
                "changed_files": changed_files
            },

            "agents": {

                "code_agent": code_result,

                "dependency_agent": {
                    "agent": dependency_result.get(
                        "agent"
                    ),
                    "status": dependency_result.get(
                        "status"
                    )
                },

                "history_agent": {
                    "agent": history_result.get(
                        "agent"
                    ),
                    "status": history_result.get(
                        "status"
                    )
                },

                "issue_pr_agent": (
                    github_history.get(
                        "agent",
                        "issue_pr_agent"
                    )
                    if isinstance(
                        github_history,
                        dict
                    )
                    else "issue_pr_agent"
                ),

                "rag_agent": {
                    "agent": rag_result.get(
                        "agent"
                    ),
                    "status": rag_result.get(
                        "status"
                    ),
                    "total_results": rag_result.get(
                        "total_results",
                        0
                    )
                }
            },

            "evidence": evidence,

            "investigation": investigation
        }