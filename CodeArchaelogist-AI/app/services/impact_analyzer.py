def build_reverse_dependency_graph(dependency_graph):
    """
    Reverse the dependency graph to determine
    which files depend on each file.
    """

    reverse_graph = {}

    for item in dependency_graph:

        source_file = item.get("file")

        if not source_file:
            continue

        for dependency in item.get("depends_on", []):

            if dependency not in reverse_graph:
                reverse_graph[dependency] = []

            reverse_graph[dependency].append(
                source_file
            )

    # Remove duplicates and sort results
    for file_name in reverse_graph:
        reverse_graph[file_name] = sorted(
            set(reverse_graph[file_name])
        )

    return reverse_graph