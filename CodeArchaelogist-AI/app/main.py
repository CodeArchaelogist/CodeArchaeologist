from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from app.services.code_analyzer import analyze_repository_code
from app.services.dependency_analyzer import build_dependency_graph
from app.services.impact_analyzer import build_reverse_dependency_graph
from app.services.git_diff_analyzer import get_commit_diff
from app.services.evidence_builder import build_investigation_evidence

from app.services.git_analyzer import get_commit_history
from app.services.github_service import clone_repository
from app.services.repo_analyzer import analyze_repository


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


@app.post("/analyze-repository")
def analyze_repository_endpoint(request: RepositoryRequest):

    try:
        repository = clone_repository(request.repo_url)

        analysis = analyze_repository(
            repository["path"]
        )

        code_analysis = analyze_repository_code(
            repository["path"]
        )

        dependency_graph = build_dependency_graph(
            code_analysis,
            repository["path"]
        )

        impact_graph = build_reverse_dependency_graph(
            dependency_graph
        )

        commits = get_commit_history(
            repository["path"],
            limit=20
        )

        evidence = build_investigation_evidence(
            code_analysis=code_analysis,
            dependencies=dependency_graph,
            impact_analysis=impact_graph,
            history={
                "commits": commits,
                "total_commits_returned": len(commits)
            }
        )

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


@app.post("/analyze-commit")
def analyze_commit_endpoint(
    repo_url: str,
    commit_hash: str
):

    try:
        repository = clone_repository(repo_url)

        code_analysis = analyze_repository_code(
            repository["path"]
        )

        dependency_graph = build_dependency_graph(
            code_analysis,
            repository["path"]
        )

        impact_graph = build_reverse_dependency_graph(
            dependency_graph
        )

        diff = get_commit_diff(
            repository["path"],
            commit_hash
        )

        commits = get_commit_history(
            repository["path"],
            limit=20
        )

        evidence = build_investigation_evidence(
            code_analysis={
                "files": code_analysis,
                "total_files_analyzed": len(code_analysis)
            },
            dependencies=dependency_graph,
            impact_analysis=impact_graph,
            history={
                "commits": commits,
                "total_commits_returned": len(commits)
            },
            commit_diff=diff
        )

        return {
            "status": "success",
            "repository": {
                "owner": repository["owner"],
                "name": repository["repo"]
            },
            "commit": {
                "hash": commit_hash
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