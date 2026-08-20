from app.services.code_analyzer import analyze_repository_code


class CodeAgent:
    """
    Code Agent responsible for understanding
    repository source code and structure.
    """

    name = "code_agent"

    def investigate(self, repo_path: str):
        """
        Analyze repository source code.

        Returns:
            Structured code evidence.
        """

        if not repo_path:
            raise ValueError("Repository path is required.")

        code_analysis = analyze_repository_code(repo_path)

        return {
            "agent": self.name,
            "status": "success",
            "files": code_analysis,
            "total_files_analyzed": len(code_analysis)
        }