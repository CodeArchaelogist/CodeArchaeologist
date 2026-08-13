// API-ready service layer. Every function currently resolves mock data with
// a small artificial delay to simulate network latency. When the backend
// exists, only the bodies of these functions need to change — call sites
// throughout the app stay identical.

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

// GET /api/investigations/:id
export async function getInvestigation(id) {
    await delay();
    return { id, repository, agentPipeline, investigationLog };
}

// GET /api/investigations/:id  (full repository summary for the dashboard)
export async function getRepository(id) {
    await delay();
    return repository;
}

// GET /api/investigations/:id/architecture
export async function getArchitecture(id) {
    await delay();
    return { architecture, dependencyGraph, nodeDetails };
}

// GET /api/investigations/:id/timeline
export async function getTimeline(id) {
    await delay();
    return timelineEvents;
}

// GET /api/investigations/:id/decisions
export async function getDecisions(id) {
    await delay();
    return decisions;
}

// GET /api/investigations/:id/risks
export async function getRisks(id) {
    await delay();
    return risks;
}

// GET /api/investigations/:id/recent
export async function getRecentRepositories() {
    await delay(150);
    return recentRepositories;
}

// POST /api/investigations/:id/questions
export async function askArchaeologist(id, question) {
    await delay(700);
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

export function getSuggestedQuestions() {
    return suggestedQuestions;
}