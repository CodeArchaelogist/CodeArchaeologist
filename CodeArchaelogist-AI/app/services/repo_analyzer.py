from pathlib import Path


IGNORED_DIRECTORIES = {
    ".git",
    "node_modules",
    "venv",
    ".venv",
    "__pycache__",
    "dist",
    "build"
}


def analyze_repository(repo_path: str):

    root = Path(repo_path)

    if not root.exists():
        raise ValueError("Repository path does not exist.")

    files = []

    for path in root.rglob("*"):

        if not path.is_file():
            continue

        if any(part in IGNORED_DIRECTORIES for part in path.parts):
            continue

        files.append(path)

    extensions = {}

    for file in files:

        extension = file.suffix.lower()

        if not extension:
            extension = "[no extension]"

        extensions[extension] = extensions.get(extension, 0) + 1

    return {
        "total_files": len(files),
        "file_types": extensions
    }