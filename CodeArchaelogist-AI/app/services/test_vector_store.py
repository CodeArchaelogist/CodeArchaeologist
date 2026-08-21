from app.services.vector_store import RepositoryVectorStore


store = RepositoryVectorStore(
    persist_directory=".chroma_test",
    collection_name="test_collection"
)


documents = [
    "The frontend dashboard displays repository investigation results.",
    "The dependency analyzer builds relationships between source files.",
    "The history agent analyzes Git commits and commit differences.",
    "The Issue PR agent retrieves GitHub pull requests and related issues.",
    "The investigation engine uses Groq to reason over collected evidence."
]


metadatas = [
    {"source": "frontend"},
    {"source": "dependency_analyzer"},
    {"source": "history_agent"},
    {"source": "issue_pr_agent"},
    {"source": "investigation_engine"}
]


ids = [
    "doc_1",
    "doc_2",
    "doc_3",
    "doc_4",
    "doc_5"
]


store.add_documents(
    documents=documents,
    metadatas=metadatas,
    ids=ids
)


print(
    "Documents stored:",
    store.count()
)


results = store.search(
    "Which component analyzes Git commit history?",
    top_k=2
)


print("\nSearch results:")

for document in results["documents"][0]:

    print(
        "-",
        document
    )