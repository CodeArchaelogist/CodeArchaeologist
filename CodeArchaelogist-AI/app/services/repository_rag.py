from pathlib import Path

from app.services.vector_store import RepositoryVectorStore


SUPPORTED_EXTENSIONS = {
    ".py",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".md",
    ".json",
    ".yml",
    ".yaml",
    ".css",
    ".html",
}


IGNORED_DIRECTORIES = {
    ".git",
    "node_modules",
    "__pycache__",
    ".venv",
    "venv",
    ".chroma",
    ".chroma_test",
}


class RepositoryRAG:

    def __init__(
        self,
        persist_directory=".chroma",
        collection_name="codearchaeologist_repository"
    ):

        self.vector_store = RepositoryVectorStore(
            persist_directory=persist_directory,
            collection_name=collection_name
        )

    def _read_file(self, file_path):

        try:

            return Path(file_path).read_text(
                encoding="utf-8"
            )

        except (UnicodeDecodeError, OSError):

            return ""

    def _chunk_text(
        self,
        text,
        chunk_size=1200,
        overlap=200
    ):

        if not text:
            return []

        chunks = []

        start = 0

        while start < len(text):

            end = start + chunk_size

            chunk = text[start:end]

            if chunk.strip():

                chunks.append(chunk)

            start += chunk_size - overlap

        return chunks

    def index_repository(
        self,
        repo_path
    ):

        repo_path = Path(repo_path)

        if not repo_path.exists():

            raise ValueError(
                f"Repository path does not exist: {repo_path}"
            )

        documents = []
        metadatas = []
        ids = []

        for file_path in repo_path.rglob("*"):

            if not file_path.is_file():
                continue

            if file_path.suffix.lower() not in SUPPORTED_EXTENSIONS:
                continue

            if any(
                directory in IGNORED_DIRECTORIES
                for directory in file_path.parts
            ):
                continue

            text = self._read_file(
                file_path
            )

            if not text.strip():
                continue

            relative_path = file_path.relative_to(
                repo_path
            )

            chunks = self._chunk_text(
                text
            )

            for index, chunk in enumerate(chunks):

                documents.append(chunk)

                metadatas.append(
                    {
                        "file": str(
                            relative_path
                        ),
                        "chunk": index,
                        "source": "repository"
                    }
                )

                ids.append(
                    f"{relative_path}:{index}"
                )

        self.vector_store.add_documents(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )

        return {
            "status": "success",
            "documents_indexed": len(documents),
            "files_processed": len(
                {
                    metadata["file"]
                    for metadata in metadatas
                }
            )
        }

    def search(
        self,
        question,
        top_k=5
    ):

        return self.vector_store.search(
            query=question,
            top_k=top_k
        )