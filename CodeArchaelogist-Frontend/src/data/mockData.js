// Central mock data source. Shape mirrors the intended backend API responses
// so that services/api.js can later be repointed at real endpoints without
// touching any component.

export const repository = {
    id: "inv_8f3a2c",
    name: "payments-platform",
    owner: "northwind-labs",
    fullName: "northwind-labs/payments-platform",
    url: "https://github.com/northwind-labs/payments-platform",
    branch: "main",
    description:
        "Core payments processing platform handling authorization, settlement, and provider routing.",
    lastAnalyzed: "2026-08-11T14:22:00Z",
    stats: {
        files: 184,
        commits: 2431,
        issues: 73,
        pullRequests: 312,
        dependencies: 142,
        riskScore: 71,
    },
    languages: [
        { name: "TypeScript", percent: 68, color: "#3FD0FF" },
        { name: "Python", percent: 18, color: "#D9A441" },
        { name: "Shell", percent: 8, color: "#3FCB8A" },
        { name: "Other", percent: 6, color: "#5B6474" },
    ],
};

export const architecture = {
    style: "Modular monolith, service-oriented internally",
    size: "184 files / 41,200 LOC",
    framework: "Node.js (Express) + TypeScript, Python workers for reconciliation",
    entryPoints: ["src/server.ts", "workers/reconcile_worker.py"],
    keyModules: [
        { name: "PaymentService", files: 12, risk: "HIGH" },
        { name: "LegacyPaymentFallback", files: 4, risk: "HIGH" },
        { name: "SettlementEngine", files: 9, risk: "MEDIUM" },
        { name: "ProviderGateway", files: 15, risk: "MEDIUM" },
        { name: "AuthService", files: 7, risk: "LOW" },
        { name: "NotificationService", files: 6, risk: "LOW" },
        { name: "AuditLogger", files: 5, risk: "LOW" },
    ],
};

export const dependencyGraph = {
    nodes: [
        { id: "PaymentService", type: "service", risk: "HIGH" },
        { id: "LegacyPaymentFallback", type: "module", risk: "HIGH" },
        { id: "ProviderGateway", type: "service", risk: "MEDIUM" },
        { id: "SettlementEngine", type: "service", risk: "MEDIUM" },
        { id: "AuthService", type: "service", risk: "LOW" },
        { id: "NotificationService", type: "service", risk: "LOW" },
        { id: "AuditLogger", type: "module", risk: "LOW" },
        { id: "stripe-sdk", type: "package", risk: "LOW" },
        { id: "legacy-provider-sdk", type: "package", risk: "HIGH" },
        { id: "webhook-queue", type: "module", risk: "MEDIUM" },
    ],
    edges: [
        { source: "PaymentService", target: "LegacyPaymentFallback" },
        { source: "PaymentService", target: "ProviderGateway" },
        { source: "PaymentService", target: "AuthService" },
        { source: "PaymentService", target: "AuditLogger" },
        { source: "ProviderGateway", target: "stripe-sdk" },
        { source: "LegacyPaymentFallback", target: "legacy-provider-sdk" },
        { source: "LegacyPaymentFallback", target: "webhook-queue" },
        { source: "SettlementEngine", target: "PaymentService" },
        { source: "SettlementEngine", target: "AuditLogger" },
        { source: "NotificationService", target: "webhook-queue" },
    ],
};

export const nodeDetails = {
    PaymentService: {
        files: 12,
        dependents: 11,
        dependencies: 7,
        risk: "HIGH",
        historicalEvents: 4,
        description:
            "Central orchestrator for authorization, capture, and refund flows across all payment providers.",
    },
    LegacyPaymentFallback: {
        files: 4,
        dependents: 3,
        dependencies: 2,
        risk: "HIGH",
        historicalEvents: 2,
        description:
            "Fallback handler routing failed primary-provider transactions to a legacy provider during timeouts.",
    },
    ProviderGateway: {
        files: 15,
        dependents: 6,
        dependencies: 3,
        risk: "MEDIUM",
        historicalEvents: 3,
        description: "Adapter layer normalizing requests across Stripe, Adyen, and the legacy provider.",
    },
    SettlementEngine: {
        files: 9,
        dependents: 2,
        dependencies: 4,
        risk: "MEDIUM",
        historicalEvents: 2,
        description: "Daily batch reconciliation between provider ledgers and internal accounting.",
    },
    AuthService: {
        files: 7,
        dependents: 8,
        dependencies: 1,
        risk: "LOW",
        historicalEvents: 1,
        description: "Session and API-key based authentication for internal service calls.",
    },
    NotificationService: {
        files: 6,
        dependents: 2,
        dependencies: 1,
        risk: "LOW",
        historicalEvents: 0,
        description: "Dispatches webhook and email notifications for transaction state changes.",
    },
    AuditLogger: {
        files: 5,
        dependents: 4,
        dependencies: 0,
        risk: "LOW",
        historicalEvents: 1,
        description: "Immutable append-only log of all financial state transitions.",
    },
    "stripe-sdk": {
        files: 0,
        dependents: 1,
        dependencies: 0,
        risk: "LOW",
        historicalEvents: 0,
        description: "Official Stripe Node SDK, pinned to v14.",
    },
    "legacy-provider-sdk": {
        files: 0,
        dependents: 1,
        dependencies: 0,
        risk: "HIGH",
        historicalEvents: 2,
        description: "Unmaintained SDK for the original 2020 payment provider. No security patches since 2023.",
    },
    "webhook-queue": {
        files: 3,
        dependents: 2,
        dependencies: 0,
        risk: "MEDIUM",
        historicalEvents: 1,
        description: "Redis-backed queue buffering outbound webhook events.",
    },
};

export const timelineEvents = [
    {
        id: "ev_1",
        year: "2019",
        date: "2019-03-04",
        title: "System Created",
        commit: "3a1f0c2",
        author: "r.dalton",
        description:
            "Initial commit of the payments platform. Single-provider design targeting Stripe only.",
        filesAffected: 22,
        importance: "MILESTONE",
        relatedPR: null,
    },
    {
        id: "ev_2",
        year: "2020",
        date: "2020-09-17",
        title: "Payment Provider Migration",
        commit: "9c3d81a",
        author: "l.merritt",
        description:
            "Added a second provider integration after Stripe rate limits caused checkout failures during a promotional spike.",
        filesAffected: 18,
        importance: "MAJOR",
        relatedPR: "#88",
    },
    {
        id: "ev_3",
        year: "2021",
        date: "2021-02-02",
        title: "Legacy Fallback Introduced",
        commit: "a81f2e9",
        author: "l.merritt",
        description:
            "LegacyPaymentFallback added to catch provider timeouts after a 47-minute checkout outage. Intended as temporary.",
        filesAffected: 11,
        importance: "MAJOR",
        relatedPR: "#142",
        relatedIssue: "#89",
    },
    {
        id: "ev_4",
        year: "2022",
        date: "2022-06-11",
        title: "Auth Service Rewrite",
        commit: "d02f7b1",
        author: "k.osei",
        description:
            "Session-based auth replaced with API keys after a third-party audit flagged session fixation risk.",
        filesAffected: 9,
        importance: "MAJOR",
        relatedPR: "#201",
    },
    {
        id: "ev_5",
        year: "2023",
        date: "2023-11-29",
        title: "Database Architecture Changed",
        commit: "f4a2c88",
        author: "m.iqbal",
        description:
            "Migrated settlement records from single Postgres instance to sharded storage after ledger table exceeded 40M rows.",
        filesAffected: 26,
        importance: "MAJOR",
        relatedPR: "#267",
    },
    {
        id: "ev_6",
        year: "2024",
        date: "2024-05-08",
        title: "Webhook Queue Introduced",
        commit: "77bd410",
        author: "k.osei",
        description:
            "Redis queue added to buffer outbound webhooks after downstream consumer outages caused delivery storms.",
        filesAffected: 6,
        importance: "MINOR",
        relatedPR: "#289",
    },
    {
        id: "ev_7",
        year: "2025",
        date: "2025-01-14",
        title: "Documentation Gap Detected",
        commit: null,
        author: "system",
        description:
            "No commit history explains why LegacyPaymentFallback still routes 4% of production traffic four years after its intended removal.",
        filesAffected: 0,
        importance: "FINDING",
        relatedPR: null,
    },
];

export const decisions = [
    {
        id: "dec_1",
        component: "PaymentService",
        question: "Why does PaymentService still use LegacyPaymentFallback?",
        historicalIntent:
            "LegacyPaymentFallback was introduced during the 2021 payment-provider migration to handle timeout failures from the primary provider during a checkout outage.",
        evidence: [
            { type: "commit", ref: "a81f2e9", label: "Commit a81f2e9 — add legacy fallback handler" },
            { type: "pr", ref: "#142", label: "Pull Request #142 — Fallback for provider timeouts" },
            { type: "issue", ref: "#89", label: "Issue #89 — Checkout outage during peak traffic" },
        ],
        affectedModules: 11,
        confidence: 91,
        risk: "HIGH",
        recommendation:
            "Preserve the fallback until equivalent behaviour is verified on the primary provider and all 11 downstream dependents are migrated off legacy-provider-sdk.",
    },
    {
        id: "dec_2",
        component: "AuthService",
        question: "Why was session-based authentication replaced with API keys?",
        historicalIntent:
            "A third-party security audit in mid-2022 flagged session fixation vulnerabilities in the original session-store implementation, prompting a full rewrite to key-based auth.",
        evidence: [
            { type: "commit", ref: "d02f7b1", label: "Commit d02f7b1 — replace session auth with API keys" },
            { type: "pr", ref: "#201", label: "Pull Request #201 — Auth service rewrite" },
        ],
        affectedModules: 7,
        confidence: 87,
        risk: "MEDIUM",
        recommendation:
            "No action required. Rotate API key signing secret annually per the original audit recommendation.",
    },
    {
        id: "dec_3",
        component: "SettlementEngine",
        question: "Why is settlement data sharded across multiple databases?",
        historicalIntent:
            "The ledger table exceeded 40 million rows in late 2023, degrading nightly reconciliation from minutes to hours. Sharding by settlement date resolved query latency.",
        evidence: [
            { type: "commit", ref: "f4a2c88", label: "Commit f4a2c88 — shard settlement storage" },
            { type: "pr", ref: "#267", label: "Pull Request #267 — Sharded settlement architecture" },
        ],
        affectedModules: 9,
        confidence: 78,
        risk: "MEDIUM",
        recommendation:
            "Monitor shard skew quarterly; current growth rate suggests re-sharding will be needed within 18 months.",
    },
];

export const risks = [
    {
        id: "risk_1",
        component: "PaymentService",
        level: "HIGH",
        dependents: 11,
        historicalFixes: 4,
        legacyDependency: true,
        documentationMissing: true,
        likelihood: 8,
        impact: 9,
        summary:
            "Central payment orchestrator with an undocumented legacy fallback and the highest dependent count in the repository.",
    },
    {
        id: "risk_2",
        component: "LegacyPaymentFallback",
        level: "HIGH",
        dependents: 3,
        historicalFixes: 2,
        legacyDependency: true,
        documentationMissing: true,
        likelihood: 6,
        impact: 9,
        summary:
            "Depends on an unmaintained SDK with no security patches since 2023. Intended as a temporary measure in 2021.",
    },
    {
        id: "risk_3",
        component: "ProviderGateway",
        level: "MEDIUM",
        dependents: 6,
        historicalFixes: 3,
        legacyDependency: false,
        documentationMissing: false,
        likelihood: 5,
        impact: 6,
        summary: "Adapter layer with growing branching logic across three provider integrations.",
    },
    {
        id: "risk_4",
        component: "SettlementEngine",
        level: "MEDIUM",
        dependents: 2,
        historicalFixes: 2,
        legacyDependency: false,
        documentationMissing: false,
        likelihood: 4,
        impact: 7,
        summary: "Sharded storage approaching capacity thresholds observed during the 2023 migration.",
    },
    {
        id: "risk_5",
        component: "webhook-queue",
        level: "MEDIUM",
        dependents: 2,
        historicalFixes: 1,
        legacyDependency: false,
        documentationMissing: true,
        likelihood: 4,
        impact: 4,
        summary: "Retry and dead-letter behaviour is undocumented outside the original PR description.",
    },
    {
        id: "risk_6",
        component: "AuditLogger",
        level: "LOW",
        dependents: 4,
        historicalFixes: 1,
        legacyDependency: false,
        documentationMissing: false,
        likelihood: 2,
        impact: 5,
        summary: "Stable append-only design with a single historical incident, resolved in 2021.",
    },
];

export const agentPipeline = [
    {
        id: "code",
        name: "Code Agent",
        description: "Parses source files, builds module and file-level structure.",
        status: "complete",
        progress: 100,
        discoveries: "184 files analyzed",
        timestamp: "10:42:14",
    },
    {
        id: "history",
        name: "History Agent",
        description: "Indexes commit history and attributes changes to authors and time periods.",
        status: "complete",
        progress: 100,
        discoveries: "2,431 commits indexed",
        timestamp: "10:42:29",
    },
    {
        id: "issues",
        name: "Issue / PR Agent",
        description: "Links issues and pull requests to the code changes they produced.",
        status: "complete",
        progress: 100,
        discoveries: "73 issues connected",
        timestamp: "10:42:41",
    },
    {
        id: "dependency",
        name: "Dependency Agent",
        description: "Maps internal and external dependency relationships.",
        status: "active",
        progress: 64,
        discoveries: "Mapping 142 relationships",
        timestamp: "10:42:55",
    },
    {
        id: "evidence",
        name: "Evidence Graph",
        description: "Cross-references commits, issues, and PRs into evidence chains.",
        status: "pending",
        progress: 0,
        discoveries: "Waiting",
        timestamp: null,
    },
    {
        id: "reasoning",
        name: "Reasoning Agent",
        description: "Synthesizes evidence chains into historical intent and recommendations.",
        status: "pending",
        progress: 0,
        discoveries: "Waiting",
        timestamp: null,
    },
];

export const investigationLog = [
    { time: "10:42:12", message: "Repository indexed" },
    { time: "10:42:18", message: "Architecture detected — modular monolith" },
    { time: "10:42:27", message: "Historical hotspot found — PaymentService" },
    { time: "10:42:31", message: "Legacy fallback identified — LegacyPaymentFallback" },
    { time: "10:42:39", message: "Cross-referencing 73 issues against commit history" },
    { time: "10:42:47", message: "Dependency graph 64% mapped" },
];

export const suggestedQuestions = [
    "Why does PaymentService still use LegacyPaymentFallback?",
    "When was the settlement engine introduced?",
    "What happens if I remove LegacyPaymentFallback?",
    "Which modules depend on ProviderGateway?",
    "Why is legacy-provider-sdk still a dependency?",
    "Was the webhook queue introduced because of an incident?",
];

export const askResponses = {
    "Why does PaymentService still use LegacyPaymentFallback?": decisions[0],
    "What happens if I remove LegacyPaymentFallback?": {
        id: "ask_1",
        component: "LegacyPaymentFallback",
        question: "What happens if I remove LegacyPaymentFallback?",
        historicalIntent:
            "Removing this module would eliminate the fallback path currently absorbing an estimated 4% of production transactions during primary-provider timeouts, based on webhook-queue traffic patterns.",
        evidence: [
            { type: "commit", ref: "a81f2e9", label: "Commit a81f2e9 — add legacy fallback handler" },
            { type: "pr", ref: "#142", label: "Pull Request #142 — Fallback for provider timeouts" },
        ],
        affectedModules: 3,
        confidence: 82,
        risk: "HIGH",
        recommendation:
            "Do not remove without first confirming primary-provider timeout rate has dropped below the 2021 incident threshold and running a shadow-traffic test.",
    },
};

export const recentRepositories = [
    { name: "payments-platform", owner: "northwind-labs", lastAnalyzed: "2 hours ago" },
    { name: "identity-gateway", owner: "northwind-labs", lastAnalyzed: "3 days ago" },
    { name: "notification-hub", owner: "northwind-labs", lastAnalyzed: "1 week ago" },
];