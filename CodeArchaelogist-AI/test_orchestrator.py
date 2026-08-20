from app.services.github_service import clone_repository
from app.agents.orchestrator import InvestigationOrchestrator


repo_url = "https://github.com/CodeArchaelogist/CodeArchaeologist"

commit_hash = "9ea1efc"

question = (
    "Why was this commit introduced, "
    "what evidence explains the change, "
    "and what could be affected if this change is removed?"
)


repository = clone_repository(repo_url)

orchestrator = InvestigationOrchestrator()

result = orchestrator.investigate(
    repository=repository,
    commit_hash=commit_hash,
    question=question
)

print(result)