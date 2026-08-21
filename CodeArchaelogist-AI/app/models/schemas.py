from pydantic import BaseModel


class RepositoryRequest(BaseModel):
    repo_url: str


class CommitRequest(BaseModel):
    repo_url: str
    commit_hash: str = "HEAD"
    question: str = "Why was this commit introduced, what evidence explains the change, and what could be affected if this change is removed?"
