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

const delay = (ms = 350) =>
    new Promise((resolve) => setTimeout(resolve, ms));

const isDemoMode = () =>
    localStorage.getItem("DEMO_MODE") !== "false";

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

async function request(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        credentials: "include",

        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },

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


export async function signup(data) {
    return request("/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function login(data) {
    return request("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function logout() {
    return request("/auth/logout", {
        method: "POST",
    });
}

export async function getMe() {
    return request("/auth/me");
}

/* ---------------- Investigations ---------------- */

export async function getInvestigation(id) {
    await delay();

    if (isDemoMode()) {
        return {
            id,
            repository,
            agentPipeline,
            investigationLog,
        };
    }

    return request(`/investigations/${id}`);
}

export async function getRepository(id) {
    await delay();

    if (isDemoMode()) {
        return repository;
    }

    return {
        name: "Live Mode Active",
        owner: "No Mock Data",
        description:
            "Connect the backend AI service to see real repository data.",
        files: [],
    };
}

export async function getArchitecture(id) {
    await delay();

    if (isDemoMode()) {
        return {
            architecture,
            dependencyGraph,
            nodeDetails,
        };
    }

    return {
        architecture: [],
        dependencyGraph: {
            nodes: [],
            links: [],
        },
        nodeDetails: {},
    };
}

export async function getTimeline(id) {
    await delay();

    if (isDemoMode()) {
        return timelineEvents;
    }

    return [];
}

export async function getDecisions(id) {
    await delay();

    if (isDemoMode()) {
        return decisions;
    }

    return [];
}

export async function getRisks(id) {
    await delay();

    if (isDemoMode()) {
        return risks;
    }

    return [];
}

export async function getRecentRepositories() {
    await delay(150);

    if (isDemoMode()) {
        return recentRepositories;
    }

    return [];
}

export async function askArchaeologist(
    id,
    question,
    repoUrl,
    commitHash
) {
    await delay(700);

    if (isDemoMode()) {
        console.warn(
            "DEMO MODE: Using mock data for Ask Archaeologist"
        );

        return (
            askResponses[question] || {
                id: "ask_generic",
                component: "PaymentService",
                question,

                historicalIntent:
                    "No direct evidence chain was found for this exact question. Related historical context is shown below based on the closest matching investigation.",

                evidence: [
                    {
                        type: "commit",
                        ref: "a81f2e9",
                        label:
                            "Commit a81f2e9 — add legacy fallback handler",
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
        "Backend not connected - switch to Demo Mode",
    ];
}

export function createInvestigation(data) {
    return request("/investigations", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function getInvestigations() {
    return request("/investigations");
}