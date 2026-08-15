from pathlib import Path
import re


SUPPORTED_EXTENSIONS = {
    ".js",
    ".jsx"
}


IGNORED_DIRECTORIES = {
    ".git",
    "node_modules",
    "dist",
    "build",
    "venv",
    ".venv",
    "__pycache__"
}


def extract_imports(content: str):
    """
    Extract imported modules/files from JavaScript and JSX code.
    """

    imports = []

    patterns = [
        r'import\s+.*?\s+from\s+[\'"](.+?)[\'"]',
        r'import\s+[\'"](.+?)[\'"]',
        r'require\s*\(\s*[\'"](.+?)[\'"]\s*\)'
    ]

    for pattern in patterns:
        matches = re.findall(pattern, content)
        imports.extend(matches)

    return sorted(set(imports))


def extract_functions(content: str):
    """
    Extract common JavaScript function declarations.
    """

    functions = []

    patterns = [
        r'function\s+([A-Za-z_$][\w$]*)\s*\(',
        r'(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\(',
        r'(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?function'
    ]

    for pattern in patterns:
        matches = re.findall(pattern, content)
        functions.extend(matches)

    return sorted(set(functions))
def classify_imports(imports):
    """
    Separate local project imports from external packages.
    """

    internal = []
    external = []

    for import_name in imports:

        if (
            import_name.startswith("./")
            or import_name.startswith("../")
            or import_name.startswith("/")
        ):
            internal.append(import_name)
        else:
            external.append(import_name)

    return internal, external

def analyze_code_file(file_path: str):
    """
    Analyze one JavaScript or JSX file.
    """

    path = Path(file_path)

    if path.suffix.lower() not in SUPPORTED_EXTENSIONS:
        return None

    try:
        content = path.read_text(
            encoding="utf-8",
            errors="replace"
        )
    except Exception:
        return None

    imports = extract_imports(content)

    internal_dependencies, external_dependencies = classify_imports(
        imports
    )

    return {
        "file": str(path),
        "language": "javascript",
        "imports": imports,
        "internal_dependencies": internal_dependencies,
        "external_dependencies": external_dependencies,
        "functions": extract_functions(content)
    }
    
    
   


def analyze_repository_code(repo_path: str):
    """
    Analyze all supported source files in a repository.
    """

    root = Path(repo_path)

    results = []

    for file_path in root.rglob("*"):

        if not file_path.is_file():
            continue

        if any(
            part in IGNORED_DIRECTORIES
            for part in file_path.parts
        ):
            continue

        if file_path.suffix.lower() not in SUPPORTED_EXTENSIONS:
            continue

        result = analyze_code_file(str(file_path))

        if result:
            results.append(result)

    return results