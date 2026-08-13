from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

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

        commits = get_commit_history(
            repository["path"],
            limit=20
        )

        return {
            "status": "success",
            "repository": {
                "owner": repository["owner"],
                "name": repository["repo"]
            },
            "analysis": analysis,
            "history": {
                "commits": commits,
                "total_commits_returned": len(commits)
            }
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