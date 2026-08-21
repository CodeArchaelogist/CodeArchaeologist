from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from app.agents.orchestrator import InvestigationOrchestrator

from app.services.code_analyzer import analyze_repository_code
from app.services.dependency_analyzer import build_dependency_graph
from app.services.impact_analyzer import build_reverse_dependency_graph
from app.services.git_diff_analyzer import get_commit_diff
from app.services.evidence_builder import build_investigation_evidence
from app.services.investigation_engine import investigate_evidence

from app.services.git_analyzer import get_commit_history
from app.services.github_service import clone_repository
from app.services.repo_analyzer import analyze_repository

from app.agents.issue_pr_agent import IssuePRAgent


app = FastAPI(
    title="CodeArchaeologist AI Service",
    description="AI service for repository intelligence and historical software analysis",
    version="0.1.0"
)


class RepositoryRequest(BaseModel):
    repo_url: str


@app.get("/")
def root():
    return {
        "service": "CodeArchaeologist AI Service",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# ============================================================
# REPOSITORY ANALYSIS
# ============================================================

@app.post("/analyze-repository")
def analyze_repository_endpoint(
    request: RepositoryRequest
):

    try:

        # ----------------------------------------------------
        # Clone repository
        # ----------------------------------------------------

        repository = clone_repository(
            request.repo_url
        )

        # ----------------------------------------------------
        # Repository analysis
        # ----------------------------------------------------

        analysis = analyze_repository(
            repository["path"]
        )

        # ----------------------------------------------------
        # Code analysis
        # ----------------------------------------------------

        code_analysis = analyze_repository_code(
            repository["path"]
        )

        # ----------------------------------------------------
        # Dependency analysis
        # ----------------------------------------------------

        dependency_graph = build_dependency_graph(
            code_analysis,
            repository["path"]
        )

        # ----------------------------------------------------
        # Reverse dependency / impact analysis
        # ----------------------------------------------------

        impact_graph = build_reverse_dependency_graph(
            dependency_graph
        )

        # ----------------------------------------------------
        # Git history
        # ----------------------------------------------------

        commits = get_commit_history(
            repository["path"],
            limit=20
        )

        # ----------------------------------------------------
        # Evidence construction
        # ----------------------------------------------------

        evidence = build_investigation_evidence(
            code_analysis=code_analysis,
            dependencies=dependency_graph,
            impact_analysis=impact_graph,
            history={
                "commits": commits,
                "total_commits_returned": len(commits)
            }
        )

        # ----------------------------------------------------
        # Response
        # ----------------------------------------------------

        return {
            "status": "success",

            "repository": {
                "owner": repository["owner"],
                "name": repository["repo"]
            },

            "analysis": analysis,

            "code_analysis": {
                "files": code_analysis,
                "total_files_analyzed": len(code_analysis)
            },

            "dependencies": dependency_graph,

            "impact_analysis": impact_graph,

            "history": {
                "commits": commits,
                "total_commits_returned": len(commits)
            },

            "evidence": evidence
        }

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except RuntimeError as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ============================================================
# COMMIT INVESTIGATION
# ============================================================

@app.post("/analyze-commit")
def analyze_commit_endpoint(
    repo_url: str,
    commit_hash: str,
    question: str
):

    try:

        # ----------------------------------------------------
        # Clone repository
        # ----------------------------------------------------

        repository = clone_repository(
            repo_url
        )
        orchestrator = InvestigationOrchestrator()

        return orchestrator.investigate(
           repository=repository,
           commit_hash=commit_hash,
           question=question
)

        # ----------------------------------------------------
        # Analyze repository code
        # ----------------------------------------------------

        code_analysis = analyze_repository_code(
            repository["path"]
        )

        # ----------------------------------------------------
        # Build dependency graph
        # ----------------------------------------------------

        dependency_graph = build_dependency_graph(
            code_analysis,
            repository["path"]
        )

        # ----------------------------------------------------
        # Build reverse dependency / impact graph
        # ----------------------------------------------------

        impact_graph = build_reverse_dependency_graph(
            dependency_graph
        )

        # ----------------------------------------------------
        # Analyze target commit
        # ----------------------------------------------------

        diff = get_commit_diff(
            repository["path"],
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

        # ----------------------------------------------------
        # Keep code analysis relevant to changed files
        # ----------------------------------------------------

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

        # ----------------------------------------------------
        # Keep dependencies relevant to changed files
        # ----------------------------------------------------

        relevant_dependencies = [

            item

            for item in dependency_graph

            if item.get("file") in changed_files
        ]

        # ----------------------------------------------------
        # Keep impact information relevant to changed files
        # ----------------------------------------------------

        relevant_impact = {}

        for changed_file in changed_files:

            if changed_file in impact_graph:

                relevant_impact[changed_file] = (
                    impact_graph[changed_file]
                )

        # ----------------------------------------------------
        # Git commit history
        # ----------------------------------------------------

        commits = get_commit_history(
            repository["path"],
            limit=20
        )

        # ----------------------------------------------------
        # GitHub Issue / PR investigation
        # ----------------------------------------------------

        issue_pr_agent = IssuePRAgent()

        github_history = issue_pr_agent.investigate(
            repository["owner"],
            repository["repo"],
            commit_hash
        )

        # ----------------------------------------------------
        # Build combined evidence
        # ----------------------------------------------------

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

            commit_diff=diff
        )

        # ----------------------------------------------------
        # Add GitHub collaboration evidence
        # ----------------------------------------------------

        evidence["github_history"] = github_history

        # ----------------------------------------------------
        # AI reasoning / investigation
        # ----------------------------------------------------

        investigation = investigate_evidence(
            evidence=evidence,
            question=question
        )

        # ----------------------------------------------------
        # Final response
        # ----------------------------------------------------

        return {

            "status": "success",

            "repository": {
                "owner": repository["owner"],
                "name": repository["repo"]
            },

            "commit": {
                "hash": commit_hash,
                "changed_files": changed_files
            },

            "evidence": evidence,

            "investigation": investigation
        }

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except RuntimeError as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )