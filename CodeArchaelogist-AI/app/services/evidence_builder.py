def build_investigation_evidence(
    code_analysis=None,
    dependencies=None,
    impact_analysis=None,
    history=None,
    commit_diff=None
):
    """
    Combine repository analysis results into a single
    structured evidence package for AI reasoning.
    """

    return {
        "code": code_analysis or {},
        "dependencies": dependencies or {},
        "impact": impact_analysis or {},
        "history": history or {},
        "commit_diff": commit_diff or {}
    }