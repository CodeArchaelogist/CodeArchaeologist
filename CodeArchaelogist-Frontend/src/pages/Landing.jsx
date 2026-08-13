import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    TbArrowRight,
    TbGitCommit,
    TbCircleDot,
    TbSearch,
    TbBrain,
    TbFileCode,
    TbNetwork,
    TbGitPullRequest,
    TbBrandGithub,
    TbRobot,
    TbLayoutDashboard,
    TbTrendingDown,
    TbTrendingUp,
    TbSitemap,
} from "react-icons/tb";
import Button from "../components/ui/Button.jsx";

// Signature hero visual: a vertical "core sample" of the repo's git history —
// oldest layers at the bottom, exactly like a geological core.
const coreSample = [
    { depth: "HEAD", label: "Current surface", hash: "f91ac3d", note: "184 files, actively maintained", weight: 1 },
    { depth: "−50", label: "Refactor era", hash: "a81f2e9", note: "PaymentService rewritten for the new provider", weight: 0.8 },
    { depth: "−210", label: "Migration layer", hash: "6c4b9f1", note: "LegacyPaymentFallback introduced to catch timeouts", weight: 0.6 },
    { depth: "−480", label: "Foundation", hash: "1e77caa", note: "Core service boundaries laid down", weight: 0.4 },
    { depth: "origin", label: "Bedrock", hash: "0000000", note: "Initial commit", weight: 0.25 },
];

// The real pain points named in the problem statement.
const painPoints = [
    "Hidden business logic",
    "Undocumented workarounds",
    "Stale documentation",
    "Slow onboarding",
    "Risky refactoring",
    "Repeated investigations",
    "Knowledge lost with employees",
    "AI acting without historical context",
];

// The actual four-stage investigation pipeline.
const investigationStages = [
    {
        step: "01 · Ingest",
        title: "Pull in the repository",
        desc: "Code, git history, issues, PRs and docs — everything the repo remembers.",
        icon: TbBrandGithub,
    },
    {
        step: "02 · Investigate",
        title: "Dispatch the agents",
        desc: "Code, History, Issue/PR and Dependency agents work the evidence in parallel.",
        icon: TbSearch,
    },
    {
        step: "03 · Connect",
        title: "Build the evidence graph",
        desc: "Code ↔ commits, issues ↔ changes, and every dependency between them.",
        icon: TbNetwork,
    },
    {
        step: "04 · Reconstruct",
        title: "Recover the decision",
        desc: "A decision timeline, historical intent, risk, and knowledge nobody remembered.",
        icon: TbBrain,
    },
];

// The three questions CodeArchaeologist actually answers.
const capabilities = [
    { title: "Evolution Timeline", question: "What changed? When? What triggered it?", icon: TbGitCommit },
    { title: "Decision Forensics", question: "Why was this code introduced? What evidence supports the answer?", icon: TbSearch },
    { title: "Change Impact", question: "What depends on it? What could break if it changes?", icon: TbSitemap },
];

// Full agent roster, orchestrator and reasoning agent included.
const agents = [
    { name: "Orchestrator Agent", role: "Plans", desc: "Plans the investigation and delegates tasks.", icon: TbRobot },
    { name: "Code Agent", role: "Investigates", desc: "Functions, classes, current architecture.", icon: TbFileCode },
    { name: "History Agent", role: "Investigates", desc: "Commits, blame, diffs, evolution.", icon: TbGitCommit },
    { name: "Issue / PR Agent", role: "Investigates", desc: "Requirements, incidents, discussions.", icon: TbGitPullRequest },
    { name: "Dependency Agent", role: "Investigates", desc: "Call paths and change impact.", icon: TbNetwork },
    { name: "Reasoning Agent", role: "Concludes", desc: "Reconstructs intent and confidence from evidence.", icon: TbBrain },
];

// Real technical workflow from ingestion to UI.
const techWorkflow = [
    { system: "GitHub", stage: "Ingest", icon: TbBrandGithub },
    { system: "Parser", stage: "Structure", icon: TbFileCode },
    { system: "History", stage: "Context", icon: TbGitCommit },
    { system: "Graph", stage: "Connect", icon: TbNetwork },
    { system: "Agents", stage: "Reason", icon: TbRobot },
    { system: "UI", stage: "Act", icon: TbLayoutDashboard },
];

const techStack = [
    { label: "AI / Agent", items: ["LLM: Gemini / GPT / Claude", "LangGraph", "Embeddings", "RAG"] },
    { label: "Code Intelligence", items: ["GitPython / GitHub API", "Tree-sitter", "AST analysis", "History, diffs, blame"] },
    { label: "Knowledge", items: ["Neo4j / NetworkX", "Vector DB", "Evidence refs", "Repository graph"] },
    { label: "Application", items: ["React", "Tailwind CSS", "FastAPI", "Cloud deployment"] },
];

const evidenceNodes = [
    { label: "Commit a81f2e9", icon: TbGitCommit },
    { label: "PR #142", icon: TbGitPullRequest },
    { label: "Issue #89", icon: TbCircleDot },
];

const decisionTimeline = [
    { year: "2019", event: "System created" },
    { year: "2020", event: "Provider migration" },
    { year: "2021", event: "Emergency fallback" },
    { year: "2023", event: "Dependency upgrade" },
    { year: "2025", event: "Documentation gap" },
];

const riskLegend = [
    { label: "High-risk dependencies", tone: "danger" },
    { label: "Undocumented workarounds", tone: "evidence" },
    { label: "Deprecated active code", tone: "accent" },
    { label: "Reconstructed rules", tone: "success" },
];

const scalabilityLevels = [
    { level: "Level 1", title: "Repository", desc: "Code + git history become a single repo's software memory." },
    { level: "Level 2", title: "Organization", desc: "Repo A + B + C merge into one organization-wide knowledge graph." },
    { level: "Level 3", title: "Continuous", desc: "Every commit, PR and issue keeps the knowledge graph living." },
];

const impactDeltas = [
    { label: "Onboarding time", direction: "down" },
    { label: "Modernization risk", direction: "down" },
    { label: "Knowledge loss", direction: "down" },
    { label: "Confidence in changes", direction: "up" },
];

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

function toneClasses(tone) {
    const map = {
        danger: "border-danger/30 bg-danger/10 text-danger",
        evidence: "border-evidence/30 bg-evidence/10 text-evidence",
        accent: "border-accent/30 bg-accent/10 text-accent",
        success: "border-success/30 bg-success/10 text-success",
    };
    return map[tone];
}

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen overflow-x-hidden bg-void text-text-primary">
            {/* Top bar */}
            <header className="sticky top-0 z-50 border-b border-border-subtle bg-void/80 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 sm:py-6">
                    <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-accent/10 text-accent">
                            <span className="font-mono text-xs font-bold">CA</span>
                        </div>
                        <span className="text-[13px] font-semibold tracking-wide">CODEARCHAEOLOGIST</span>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => navigate("/analyze")}>
                        Investigate<span className="hidden sm:inline">&nbsp;a Repository</span>
                    </Button>
                </div>
            </header>

            {/* Hero */}
            <section className="relative overflow-hidden px-4 pb-20 pt-14 sm:px-6 sm:pb-24 sm:pt-16 lg:pb-32 lg:pt-20">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage:
                            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                        color: "var(--color-border, #333)",
                    }}
                />

                <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
                            An autonomous AI agent for software history &amp; decision forensics
                        </p>
                        <h1 className="mt-4 text-[2.5rem] font-semibold leading-[1.05] tracking-tight text-text-primary sm:text-5xl lg:text-[3.4rem]">
                            Don't just understand the code.{" "}
                            <span className="relative inline-block text-accent">
                                Discover why it survived.
                                <svg
                                    aria-hidden
                                    viewBox="0 0 200 12"
                                    className="absolute -bottom-1 left-0 h-3 w-full text-accent/40"
                                    preserveAspectRatio="none"
                                >
                                    <path d="M0 8 Q 50 0 100 6 T 200 4" stroke="currentColor" strokeWidth="3" fill="none" />
                                </svg>
                            </span>
                        </h1>
                        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-text-muted">
                            CodeArchaeologist sends specialized AI agents through your commits, issues and
                            pull requests to reconstruct the decisions buried inside your GitHub repository —
                            and tells you what breaks if you disturb them.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Button size="lg" icon={TbArrowRight} iconPosition="right" onClick={() => navigate("/analyze")}>
                                Investigate a Repository
                            </Button>
                            <Button variant="secondary" size="lg" onClick={() => navigate("/dashboard/inv_8f3a2c")}>
                                Explore Demo
                            </Button>
                        </div>
                        <p className="mt-6 font-mono text-[11px] tracking-wide text-text-faint">
                            184 files mapped · 2,431 commits indexed · 91% avg. confidence
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="rounded-xl border border-border bg-surface p-5 sm:p-6"
                    >
                        <div className="mb-5 flex items-center justify-between">
                            <p className="font-mono text-[11px] uppercase tracking-widest text-text-faint">
                                Core sample — main branch
                            </p>
                            <span className="font-mono text-[10px] text-text-faint">hover a layer</span>
                        </div>
                        <div className="flex flex-col">
                            {coreSample.map((layer) => (
                                <div
                                    key={layer.hash}
                                    className="group relative flex items-center gap-3 border-t border-border-subtle py-3 first:border-t-0"
                                    style={{ backgroundColor: `color-mix(in srgb, var(--color-accent, #3ddc97) ${layer.weight * 14}%, transparent)` }}
                                >
                                    <span className="w-12 shrink-0 font-mono text-[10px] text-text-faint">{layer.depth}</span>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-medium text-text-primary">{layer.label}</p>
                                        <p className="hidden truncate text-[11px] text-text-muted transition-all duration-200 group-hover:mt-0.5 group-hover:block">
                                            {layer.note}
                                        </p>
                                    </div>
                                    <span className="shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-text-faint">
                                        {layer.hash}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Problem */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="border-t border-border-subtle bg-surface/40 px-4 py-16 sm:px-6 sm:py-20"
            >
                <div className="mx-auto max-w-5xl">
                    <p className="text-center font-mono text-[11px] uppercase tracking-widest text-evidence">
                        The problem
                    </p>
                    <h2 className="mt-3 text-center text-xl font-semibold text-text-primary sm:text-2xl">
                        The code tells us what. The history tells us why.
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-text-muted">
                        Mature software contains years of decisions, but their reasoning is scattered across
                        the repository. Engineers inherit systems without the context of the people who built
                        them.
                    </p>

                    <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div className="rounded-xl border border-border bg-surface p-5">
                            <p className="font-mono text-[11px] uppercase tracking-widest text-text-faint">A mystery</p>
                            <pre className="mt-4 overflow-x-auto rounded-lg border border-border-subtle bg-void p-4 font-mono text-xs leading-relaxed text-text-muted">
                                {`if (account.type == X)
  useLegacyPayment();`}
                            </pre>
                            <p className="mt-4 text-sm text-text-muted">
                                The code says <span className="text-text-primary">WHAT</span>. The engineer
                                needs <span className="text-accent">WHY</span>.
                            </p>
                        </div>

                        <div className="rounded-xl border border-border bg-surface p-5">
                            <p className="font-mono text-[11px] uppercase tracking-widest text-text-faint">Why it matters</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {painPoints.map((point) => (
                                    <span key={point} className="rounded-full border border-border px-3 py-1 text-xs text-text-muted">
                                        {point}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-text-muted">
                        <span className="text-text-primary">Root problem:</span> the repository stores the
                        result of thousands of decisions — but their intent is fragmented across code,
                        commits, issues, PRs and docs.
                    </p>
                </div>
            </motion.section>

            {/* Solution: 4-stage investigation */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="px-4 py-16 sm:px-6 sm:py-20"
            >
                <div className="mx-auto max-w-6xl">
                    <p className="font-mono text-[11px] uppercase tracking-widest text-accent">Solution</p>
                    <h2 className="mt-3 text-xl font-semibold text-text-primary sm:text-2xl">
                        Meet CodeArchaeologist — an autonomous software historian.
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-muted">
                        It investigates the present <span className="text-text-primary">and</span> the past of
                        a repository, one stage at a time.
                    </p>

                    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {investigationStages.map((stage) => (
                            <div key={stage.step} className="rounded-lg border border-border bg-surface p-4">
                                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/10 text-accent">
                                    <stage.icon size={15} />
                                </span>
                                <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-text-faint">
                                    {stage.step}
                                </p>
                                <p className="mt-1 text-sm font-medium text-text-primary">{stage.title}</p>
                                <p className="mt-2 text-xs leading-relaxed text-text-muted">{stage.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {capabilities.map((cap) => (
                            <div key={cap.title} className="rounded-lg border border-border bg-surface/60 p-4 transition-colors duration-200 hover:border-accent/40">
                                <div className="flex items-center gap-2">
                                    <cap.icon size={14} className="text-evidence" />
                                    <p className="text-sm font-medium text-text-primary">{cap.title}</p>
                                </div>
                                <p className="mt-2 text-xs leading-relaxed text-text-muted">{cap.question}</p>
                            </div>
                        ))}
                    </div>

                    <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-widest text-text-faint">
                        Other AI tools read the code. CodeArchaeologist investigates the story behind it.
                    </p>
                </div>
            </motion.section>

            {/* Agent architecture */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="border-t border-border-subtle px-4 py-16 sm:px-6 sm:py-20"
            >
                <div className="mx-auto max-w-6xl">
                    <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
                        Multi-agent architecture
                    </p>
                    <h2 className="mt-3 text-xl font-semibold text-text-primary sm:text-2xl">
                        Plan → delegate → gather evidence → reason → explain with sources.
                    </h2>

                    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {agents.map((agent) => (
                            <div key={agent.name} className="group rounded-lg border border-border bg-surface p-5 transition-colors duration-200 hover:border-accent/40">
                                <div className="flex items-start justify-between">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/10 text-accent transition-transform duration-200 group-hover:scale-110">
                                        <agent.icon size={15} />
                                    </span>
                                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-faint">
                                        {agent.role}
                                    </span>
                                </div>
                                <p className="mt-3 text-sm font-medium text-text-primary">{agent.name}</p>
                                <p className="mt-2 text-xs leading-relaxed text-text-muted">{agent.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 rounded-lg border border-border-subtle bg-surface/40 px-5 py-4 text-center font-mono text-xs uppercase tracking-widest text-text-faint">
                        No evidence <TbArrowRight className="mx-2 inline" size={12} /> no confident claim
                    </div>
                </div>
            </motion.section>

            {/* Decision Forensics preview */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="border-t border-border-subtle bg-surface/40 px-4 py-16 sm:px-6 sm:py-20"
            >
                <div className="mx-auto max-w-4xl">
                    <p className="font-mono text-[11px] uppercase tracking-widest text-evidence">
                        Decision forensics
                    </p>
                    <h2 className="mt-3 text-xl font-semibold text-text-primary sm:text-2xl">
                        Reconstruct the reasoning behind the code.
                    </h2>

                    <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-surface p-6">
                        <div className="flex min-w-max items-center gap-0 sm:min-w-0">
                            {decisionTimeline.map((point, i) => (
                                <div key={point.year} className="flex items-center">
                                    <div className="flex flex-col items-center px-3 text-center">
                                        <span className="font-mono text-[11px] text-text-faint">{point.year}</span>
                                        <span className="mt-1 h-2 w-2 rounded-full bg-accent" />
                                        <span className="mt-2 w-20 text-[11px] leading-tight text-text-muted">
                                            {point.event}
                                        </span>
                                    </div>
                                    {i < decisionTimeline.length - 1 && (
                                        <span className="h-px w-8 bg-border sm:w-12" />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 grid grid-cols-1 gap-6 border-t border-border-subtle pt-6 md:grid-cols-[1fr_auto]">
                            <div>
                                <p className="font-mono text-xs text-text-faint">PaymentService</p>
                                <p className="mt-2 text-base font-medium text-text-primary">
                                    Why does PaymentService still use LegacyPaymentFallback?
                                </p>
                                <p className="mt-4 text-sm leading-relaxed text-text-muted">
                                    LegacyPaymentFallback was introduced during the 2021 payment-provider migration to
                                    handle timeout failures.
                                </p>
                                <div className="mt-5 flex flex-wrap gap-2 font-mono text-[11px] text-text-faint">
                                    {evidenceNodes.map((node) => (
                                        <span key={node.label} className="flex items-center gap-1.5 rounded border border-border px-2 py-1">
                                            <node.icon size={12} />
                                            {node.label}
                                        </span>
                                    ))}
                                    <span className="rounded border border-success/30 bg-success/10 px-2 py-1 text-success">
                                        91% confidence
                                    </span>
                                </div>
                            </div>

                            <div className="relative hidden h-32 w-40 shrink-0 items-center justify-center md:flex">
                                <svg viewBox="0 0 160 128" className="absolute inset-0 h-full w-full text-border">
                                    <line x1="24" y1="20" x2="80" y2="100" stroke="currentColor" strokeWidth="1" />
                                    <line x1="80" y1="16" x2="80" y2="100" stroke="currentColor" strokeWidth="1" />
                                    <line x1="136" y1="20" x2="80" y2="100" stroke="currentColor" strokeWidth="1" />
                                </svg>
                                {[{ x: 24, y: 20 }, { x: 80, y: 16 }, { x: 136, y: 20 }].map((pt, i) => (
                                    <span
                                        key={i}
                                        className="absolute h-2.5 w-2.5 rounded-full border border-accent/50 bg-accent/20"
                                        style={{ left: pt.x - 5, top: pt.y - 5 }}
                                    />
                                ))}
                                <span
                                    className="absolute h-3.5 w-3.5 rounded-full border-2 border-accent bg-accent/30"
                                    style={{ left: 80 - 7, top: 100 - 7 }}
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2 border-t border-border-subtle pt-6">
                            {riskLegend.map((risk) => (
                                <span key={risk.label} className={`rounded-full border px-3 py-1 text-[11px] ${toneClasses(risk.tone)}`}>
                                    {risk.label}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Technical workflow + stack */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="px-4 py-16 sm:px-6 sm:py-20"
            >
                <div className="mx-auto max-w-6xl">
                    <p className="font-mono text-[11px] uppercase tracking-widest text-accent">Technology used</p>
                    <h2 className="mt-3 text-xl font-semibold text-text-primary sm:text-2xl">
                        Deterministic code intelligence + agentic reasoning + connected evidence.
                    </h2>

                    <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                        {techWorkflow.map((step, i) => (
                            <div key={step.system} className="relative rounded-lg border border-border bg-surface p-4 text-center">
                                <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-md bg-accent/10 text-accent">
                                    <step.icon size={15} />
                                </span>
                                <p className="mt-2 text-xs font-medium text-text-primary">{step.system}</p>
                                <p className="font-mono text-[10px] uppercase tracking-widest text-text-faint">{step.stage}</p>
                                {i < techWorkflow.length - 1 && (
                                    <span className="absolute -right-2.5 top-1/2 hidden -translate-y-1/2 text-text-faint lg:block">
                                        →
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {techStack.map((col) => (
                            <div key={col.label} className="rounded-lg border border-border bg-surface/60 p-4">
                                <p className="font-mono text-[11px] uppercase tracking-widest text-text-faint">{col.label}</p>
                                <ul className="mt-3 space-y-1.5 text-xs text-text-muted">
                                    {col.items.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <p className="mt-8 text-center text-xs text-text-faint">
                        Deterministic tools understand structure. AI understands meaning. The knowledge layer connects both.
                    </p>
                </div>
            </motion.section>

            {/* Vision / scalability */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="border-t border-border-subtle bg-surface/40 px-4 py-16 sm:px-6 sm:py-20"
            >
                <div className="mx-auto max-w-6xl">
                    <p className="font-mono text-[11px] uppercase tracking-widest text-evidence">Long-term vision</p>
                    <h2 className="mt-3 text-xl font-semibold text-text-primary sm:text-2xl">
                        A living memory layer for software.
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-muted">
                        From one repository to a continuously updated institutional memory layer for
                        engineering teams.
                    </p>

                    <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
                        {scalabilityLevels.map((lvl) => (
                            <div key={lvl.level} className="rounded-lg border border-border bg-surface p-5">
                                <p className="font-mono text-[11px] uppercase tracking-widest text-accent">{lvl.level}</p>
                                <p className="mt-2 text-sm font-medium text-text-primary">{lvl.title}</p>
                                <p className="mt-2 text-xs leading-relaxed text-text-muted">{lvl.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-lg border border-border bg-surface/60 p-4">
                            <p className="font-mono text-[11px] uppercase tracking-widest text-text-faint">Built for</p>
                            <p className="mt-2 text-xs leading-relaxed text-text-muted">
                                Enterprise engineering · Startups · Critical systems · Software teams
                            </p>
                        </div>
                        <div className="rounded-lg border border-border bg-surface/60 p-4">
                            <p className="font-mono text-[11px] uppercase tracking-widest text-text-faint">Impact</p>
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
                                {impactDeltas.map((d) => (
                                    <span key={d.label} className="flex items-center gap-1 text-xs text-text-muted">
                                        {d.direction === "down" ? (
                                            <TbTrendingDown size={13} className="text-success" />
                                        ) : (
                                            <TbTrendingUp size={13} className="text-success" />
                                        )}
                                        {d.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Final CTA */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="px-4 py-20 text-center sm:py-24"
            >
                <h2 className="mx-auto max-w-2xl text-xl font-semibold leading-snug text-text-primary sm:text-2xl">
                    Code can survive its creator. Its context shouldn't have to die with them.
                </h2>
                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <Button size="lg" icon={TbArrowRight} iconPosition="right" onClick={() => navigate("/analyze")}>
                        Investigate a Repository
                    </Button>
                </div>
            </motion.section>

            <footer className="border-t border-border-subtle px-4 py-8 text-center text-[11px] text-text-faint sm:px-6">
                CodeArchaeologist — engineering intelligence, reconstructed.
            </footer>
        </div>
    );
}