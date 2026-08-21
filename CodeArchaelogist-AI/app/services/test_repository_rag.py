from app.services.repository_rag import RepositoryRAG


repository_path = "."


rag = RepositoryRAG(
    persist_directory=".chroma_repository_test",
    collection_name="repository_test"
)


result = rag.index_repository(
    repository_path
)


print("\nINDEXING RESULT")
print(result)


results = rag.search(
    "How does the investigation orchestrator analyze a commit?",
    top_k=5
)


print("\nRETRIEVED EVIDENCE")

for document, metadata in zip(
    results["documents"][0],
    results["metadatas"][0]
):

    print("\nFILE:", metadata["file"])
    print("CHUNK:", metadata["chunk"])
    print(document[:500])