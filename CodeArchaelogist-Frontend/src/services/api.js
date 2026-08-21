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

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

// The global check: Defaults to true (Demo Mode) unless explicitly set to false
const isDemoMode = () => localStorage.getItem('DEMO_MODE') !== 'false';

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

async function request(
    endpoint,
    options = {}
) {
    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            credentials: "include",

            headers: {
                "Content-Type":
                    "application/json",
                ...(options.headers || {}),
            },

            ...options,
        }
    );

    let data = null;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        throw new Error(
            data?.message ||
            "Something went wrong."
        );
    }

    return data;
}

// GET /api/investigations/:id
export async function getInvestigation(id) {
    await delay();
    if (isDemoMode()) return { id, repository, agentPipeline, investigationLog };

    // Live Mode: real backend call
    return request(`/investigations/${id}`);
}

// GET /api/investigations/:id (full repository summary for the dashboard)
export async function getRepository(id) {
    await delay();
    if (isDemoMode()) return repository;

    // Live Mode Empty State
    return {
        name: "Live Mode Active",
        owner: "No Mock Data",
        description: "Connect the backend AI service to see real repository data.",
        files: []
    };
}

// GET /api/investigations/:id/architecture
export async function getArchitecture(id) {
    await delay();
    if (isDemoMode()) return { architecture, dependencyGraph, nodeDetails };

    // Live Mode Empty State
    return { architecture: [], dependencyGraph: { nodes: [], links: [] }, nodeDetails: {} };
}

// GET /api/investigations/:id/timeline
export async function getTimeline(id) {
    await delay();
    if (isDemoMode()) return timelineEvents;
    return []; // Empty timeline
}

// GET /api/investigations/:id/decisions
export async function getDecisions(id) {
    await delay();
    if (isDemoMode()) return decisions;
    return []; // Empty decisions
}

// GET /api/investigations/:id/risks
export async function getRisks(id) {
    await delay();
    if (isDemoMode()) return risks;
    return []; // Empty risks
}

// GET /api/investigations/:id/recent
export async function getRecentRepositories() {
    await delay(150);
    if (isDemoMode()) return recentRepositories;
    return []; // Empty recent repos
}

// POST /api/investigations/:id/questions
export async function askArchaeologist(id, question, repoUrl, commitHash) {
    await delay(700);

    if (isDemoMode()) {
        console.warn("DEMO MODE: Using mock data for Ask Archaeologist");
        return (
            askResponses[question] || {
                id: "ask_generic",
                component: "PaymentService",
                question,
                historicalIntent:
                    "No direct evidence chain was found for this exact question. Related historical context is shown below based on the closest matching investigation.",
                evidence: [
                    { type: "commit", ref: "a81f2e9", label: "Commit a81f2e9 — add legacy fallback handler" },
                ],
                affectedModules: 1,
                confidence: 41,
                risk: "MEDIUM",
                recommendation: "Refine the question with a specific component or file name for a higher-confidence answer.",
            }
        );
    }

    // LIVE MODE: Returns a clear "Not Connected" message instead of crashing
    console.error("LIVE MODE: Attempting live API call (Not yet integrated)");
    return {
        id: "live_pending",
        component: "None",
        question: question,
        historicalIntent: "Live mode is active, but the backend is not connected. No data available.",
        evidence: [],
        affectedModules: 0,
        confidence: 0,
        risk: "UNKNOWN",
        recommendation: "Double-click the header text on the landing page to switch back to Demo Mode."
    };
}

export function getSuggestedQuestions() {
    if (isDemoMode()) return suggestedQuestions;
    return ["Backend not connected - switch to Demo Mode"];
}

export function signup(data) {
    return request("/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function login(data) {
    return request("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function logout() {
    return request("/auth/logout", {
        method: "POST",
    });
}

export function getMe() {
    return request("/auth/me");
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