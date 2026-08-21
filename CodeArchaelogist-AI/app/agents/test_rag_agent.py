from app.agents.rag_agent import RAGAgent


agent = RAGAgent()

result = agent.investigate(
    repo_path=".",
    question=(
        "How does the investigation orchestrator "
        "analyze a commit?"
    ),
    top_k=5
)

print("RAG AGENT STATUS:")
print(result["status"])

print("\nRESULTS FOUND:")
print(result["total_results"])

print("\nRETRIEVED FILES:")

for item in result["retrieved_evidence"]:

    metadata = item["metadata"]

    print(
        "-",
        metadata.get("file"),
        "chunk:",
        metadata.get("chunk")
    )