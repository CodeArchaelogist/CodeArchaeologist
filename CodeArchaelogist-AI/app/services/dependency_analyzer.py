from pathlib import Path


def resolve_import_path(source_file, import_path):
    """
    Resolve a relative JavaScript/JSX import to an actual file.
    """

    if not source_file or not import_path:
        return None

    source_path = Path(str(source_file))

    if not (
        import_path.startswith("./")
        or import_path.startswith("../")
        or import_path.startswith("/")
    ):
        return None

    target = (source_path.parent / import_path).resolve()

    # Exact path
    if target.is_file():
        return target

    # Try JavaScript extensions
    for extension in [".js", ".jsx", ".ts", ".tsx"]:
        candidate = Path(str(target) + extension)

        if candidate.is_file():
            return candidate

    # Try index files
    for extension in [".js", ".jsx", ".ts", ".tsx"]:
        candidate = target / f"index{extension}"

        if candidate.is_file():
            return candidate

    return None


def build_dependency_graph(code_analysis, repo_path):
    """
    Build file-to-file dependency relationships.
    """

    if not repo_path:
        return []

    repo_root = Path(str(repo_path)).resolve()

    graph = []

    for file_data in code_analysis:

        if not file_data:
            continue

        source_file = file_data.get("file")

        if not source_file:
            continue

        source_path = Path(str(source_file)).resolve()

        dependencies = []

        internal_dependencies = file_data.get(
            "internal_dependencies",
            []
        )

        for import_path in internal_dependencies:

            target_file = resolve_import_path(
                source_path,
                import_path
            )

            if target_file is None:
                continue

            try:
                relative_target = target_file.relative_to(
                    repo_root
                ).as_posix()

                dependencies.append(relative_target)

            except ValueError:
                continue

        try:
            relative_source = source_path.relative_to(
                repo_root
            ).as_posix()

        except ValueError:
            relative_source = source_path.name

        graph.append(
            {
                "file": relative_source,
                "depends_on": sorted(set(dependencies))
            }
        )

    return graph    