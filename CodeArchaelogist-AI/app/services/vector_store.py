from pathlib import Path

import chromadb
from sentence_transformers import SentenceTransformer


class RepositoryVectorStore:
    """
    Vector store for repository knowledge.

    Uses Sentence Transformers to create embeddings
    and ChromaDB for persistent vector storage.
    """

    def __init__(
        self,
        persist_directory: str = ".chroma",
        collection_name: str = "repository_knowledge"
    ):
        self.persist_directory = persist_directory
        self.collection_name = collection_name

        # Embedding model
        self.embedding_model = SentenceTransformer(
            "all-MiniLM-L6-v2"
        )

        # Persistent Chroma database
        Path(
            self.persist_directory
        ).mkdir(
            parents=True,
            exist_ok=True
        )

        self.client = chromadb.PersistentClient(
            path=self.persist_directory
        )

        self.collection = (
            self.client.get_or_create_collection(
                name=self.collection_name
            )
        )

    def add_documents(
        self,
        documents: list[str],
        metadatas: list[dict],
        ids: list[str]
    ):
        """
        Add repository documents to the vector store.
        """

        if not documents:
            return

        if not (
            len(documents)
            == len(metadatas)
            == len(ids)
        ):
            raise ValueError(
                "Documents, metadata and IDs "
                "must have the same length."
            )

        embeddings = (
            self.embedding_model.encode(
                documents
            ).tolist()
        )

        self.collection.upsert(
            ids=ids,
            documents=documents,
            metadatas=metadatas,
            embeddings=embeddings
        )

    def search(
        self,
        query: str,
        top_k: int = 5
    ):
        """
        Retrieve the most relevant repository
        documents for a query.
        """

        if not query:
            raise ValueError(
                "Search query is required."
            )

        query_embedding = (
            self.embedding_model.encode(
                [query]
            )[0]
            .tolist()
        )

        results = self.collection.query(
            query_embeddings=[
                query_embedding
            ],
            n_results=top_k
        )

        return results

    def count(self):
        """
        Return number of stored documents.
        """

        return self.collection.count()