import {
    repository,
    architecture,
    dependencyGraph,
    nodeDetails,
    timelineEvents,
    decisions,
    risks,
    agentPipeline,
    investigationLog,
    suggestedQuestions,
    askResponses,
    recentRepositories,
} from "../data/mockData.js";

const isDemoMode = () =>
    localStorage.getItem("DEMO_MODE") !== "false";

const API_BASE_URL = (
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000/api"
).replace(/\/$/, "");

// Simple in-memory cache to avoid duplicate investigation fetches across tabs
const investigationCache = new Map();

async function request(endpoint, options = {}) {
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        credentials: "include",
        headers,
        ...options,
    });

    let data = null;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        throw new Error(
            data?.message || `Request failed with status ${response.status}`
        );
    }

    return data;
}

/* ---------------- Authentication ---------------- */

export async function signup(data) {
    const res = await request("/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
    });
    if (res?.token) {
        localStorage.setItem("token", res.token);
    }
    return res;
}

export async function login(data) {
    const res = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
    });
    if (res?.token) {
        localStorage.setItem("token", res.token);
    }
    return res;
}

export async function logout() {
    investigationCache.clear();
    localStorage.removeItem("token");
    return request("/auth/logout", {
        method: "POST",
    });
}

export async function getMe() {
    return request("/auth/me");
}

/* ---------------- Investigations ---------------- */

export async function getInvestigation(id) {
    if (isDemoMode()) {
        return {
            id,
            repository,
            agentPipeline,
            investigationLog,
            architecture,
            dependencyGraph,
            nodeDetails,
            timelineEvents,
            decisions,
            risks,
        };
    }

    const data = await request(`/investigations/${id}`);
    if (data) {
        investigationCache.set(id, data);
    }
    return data;
}

export async function getRepository(id) {
    if (isDemoMode()) {
        return repository;
    }

    let inv = investigationCache.get(id);
    if (!inv) {
        inv = await getInvestigation(id);
    }

    return inv?.repository || {
        id,
        name: "Repository",
        owner: "Unknown",
        fullName: "Repository",
        url: "#",
        branch: "main",
        description: "Live investigation data.",
        lastAnalyzed: new Date().toISOString(),
        stats: {
            files: 0,
            commits: 0,
            issues: 0,
            pullRequests: 0,
            dependencies: 0,
            riskScore: 0,
        },
        languages: [],
    };
}

export async function getArchitecture(id) {
    if (isDemoMode()) {
        return {
            architecture,
            dependencyGraph,
            nodeDetails,
        };
    }

    let inv = investigationCache.get(id);
    if (!inv) {
        inv = await getInvestigation(id);
    }

    return {
        architecture: inv?.architecture || {
            style: "Repository Architecture",
            size: "Analyzed",
            framework: "JavaScript",
            entryPoints: [],
            keyModules: [],
        },
        dependencyGraph: inv?.dependencyGraph || {
            nodes: [],
            edges: [],
        },
        nodeDetails: inv?.nodeDetails || {},
    };
}

export async function getTimeline(id) {
    if (isDemoMode()) {
        return timelineEvents;
    }

    let inv = investigationCache.get(id);
    if (!inv) {
        inv = await getInvestigation(id);
    }

    return inv?.timelineEvents || [];
}

export async function getDecisions(id) {
    if (isDemoMode()) {
        return decisions;
    }

    let inv = investigationCache.get(id);
    if (!inv) {
        inv = await getInvestigation(id);
    }

    return inv?.decisions || [];
}

export async function getRisks(id) {
    if (isDemoMode()) {
        return risks;
    }

    let inv = investigationCache.get(id);
    if (!inv) {
        inv = await getInvestigation(id);
    }

    return inv?.risks || [];
}

export async function getRecentRepositories() {
    if (isDemoMode()) {
        return recentRepositories;
    }

    try {
        const data = await getInvestigations();
        const list = data?.investigations || data || [];

        const unique = [];
        const seen = new Set();

        for (const item of list) {
            const repo = item.repositoryId;
            if (repo && !seen.has(repo._id || repo.repoUrl)) {
                seen.add(repo._id || repo.repoUrl);
                unique.push({
                    name: repo.repoName,
                    owner: repo.owner,
                    url: repo.repoUrl,
                    investigationId: item._id,
                    lastAnalyzed: new Date(item.createdAt).toLocaleDateString(),
                });
            }
        }

        return unique.slice(0, 5);
    } catch {
        return [];
    }
}

export async function askArchaeologist(id, question, repoUrl, commitHash) {
    if (isDemoMode()) {
        return (
            askResponses[question] || {
                id: "ask_generic",
                component: "PaymentService",
                question,
                historicalIntent:
                    "No direct evidence chain was found for this exact question in demo mode.",
                evidence: [
                    {
                        type: "commit",
                        ref: "a81f2e9",
                        label: "Commit a81f2e9 — add legacy fallback handler",
                    },
                ],
                affectedModules: 1,
                confidence: 41,
                risk: "MEDIUM",
                recommendation:
                    "Refine the question with a specific component or file name for a higher-confidence answer.",
            }
        );
    }

    return request(`/investigations/${id}/questions`, {
        method: "POST",
        body: JSON.stringify({
            question,
            repoUrl,
            commitHash,
        }),
    });
}

export function getSuggestedQuestions() {
    if (isDemoMode()) {
        return suggestedQuestions;
    }

    return [
        "Why was this commit introduced?",
        "What components or files are affected by this change?",
        "What are the potential risks of altering or removing this code?",
        "What evidence supports the historical reasoning for this implementation?",
    ];
}

export async function createInvestigation(data) {
    const res = await request("/investigations", {
        method: "POST",
        body: JSON.stringify(data),
    });

    if (res?.investigation?.id) {
        investigationCache.set(res.investigation.id, res);
    } else if (res?.id) {
        investigationCache.set(res.id, res);
    }

    return res;
}

export async function getInvestigations() {
    return request("/investigations");
}