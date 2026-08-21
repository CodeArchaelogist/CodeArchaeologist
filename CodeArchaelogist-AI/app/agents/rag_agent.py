from app.services.repository_rag import RepositoryRAG


class RAGAgent:
    """
    RAG Agent responsible for retrieving
    relevant repository knowledge for an
    investigation question.
    """

    name = "rag_agent"

    def __init__(self):
        self.rag = RepositoryRAG(
            persist_directory=".chroma",
            collection_name="codearchaeologist_repository"
        )

    def investigate(
        self,
        repo_path: str,
        question: str,
        top_k: int = 5
    ):
        """
        Retrieve relevant repository evidence.
        """

        if not repo_path:
            raise ValueError(
                "Repository path is required."
            )

        if not question:
            raise ValueError(
                "Investigation question is required."
            )

        # Build/update repository knowledge
        indexing_result = (
            self.rag.index_repository(
                repo_path
            )
        )

        # Retrieve relevant evidence
        results = self.rag.search(
            question,
            top_k=top_k
        )

        documents = results.get(
            "documents",
            [[]]
        )[0]

        metadatas = results.get(
            "metadatas",
            [[]]
        )[0]

        retrieved_evidence = []

        for document, metadata in zip(
            documents,
            metadatas
        ):

            retrieved_evidence.append(
                {
                    "content": document,
                    "metadata": metadata
                }
            )

        return {
            "agent": self.name,
            "status": "success",
            "indexing": indexing_result,
            "query": question,
            "retrieved_evidence": retrieved_evidence,
            "total_results": len(
                retrieved_evidence
            )
        }