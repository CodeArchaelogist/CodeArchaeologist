from app.services.dependency_analyzer import build_dependency_graph
from app.services.impact_analyzer import build_reverse_dependency_graph


class DependencyAgent:
    """
    Dependency Agent responsible for understanding
    dependency relationships and potential change impact.
    """

    name = "dependency_agent"

    def investigate(
        self,
        code_analysis,
        repo_path: str
    ):
        """
        Build dependency and reverse-dependency information.
        """

        if not repo_path:
            raise ValueError("Repository path is required.")

        dependency_graph = build_dependency_graph(
            code_analysis,
            repo_path
        )

        reverse_dependency_graph = (
            build_reverse_dependency_graph(
                dependency_graph
            )
        )

        return {
            "agent": self.name,
            "status": "success",
            "dependencies": dependency_graph,
            "impact": reverse_dependency_graph
        }

    def investigate_change_impact(
        self,
        dependency_graph,
        impact_graph,
        changed_files
    ):
        """
        Determine which repository components may be affected
        by changes to the selected files.
        """

        affected = {}

        for file_path in changed_files:

            affected[file_path] = {
                "direct_dependencies": [],
                "affected_dependents": impact_graph.get(
                    file_path,
                    []
                )
            }

            for item in dependency_graph:

                if item.get("file") == file_path:
                    affected[file_path][
                        "direct_dependencies"
                    ] = item.get(
                        "depends_on",
                        []
                    )

        return affected