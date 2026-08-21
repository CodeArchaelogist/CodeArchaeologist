import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TbArrowRight, TbGitCommit, TbCircleDot, TbSearch, TbBrain, TbLayersIntersect } from "react-icons/tb";
import Button from "../components/ui/Button.jsx";
import ThemeToggle from "../components/ui/ThemeToggle.jsx";

const investigationSteps = [
    { label: "CODE", icon: TbLayersIntersect },
    { label: "COMMIT", icon: TbGitCommit },
    { label: "ISSUE", icon: TbCircleDot },
    { label: "DECISION", icon: TbBrain },
    { label: "EVIDENCE", icon: TbSearch },
];

const agents = [
    { name: "Code Agent", desc: "Parses structure, modules, and entry points." },
    { name: "History Agent", desc: "Indexes commit history and authorship over time." },
    { name: "Issue / PR Agent", desc: "Links discussions to the code they produced." },
    { name: "Dependency Agent", desc: "Maps internal and external relationships." },
    { name: "Reasoning Agent", desc: "Synthesizes evidence into historical intent." },
];

export default function Landing() {
    const navigate = useNavigate();

    // The hidden toggle logic
    const handleToggleDemo = () => {
        const currentMode = localStorage.getItem('DEMO_MODE') !== 'false';
        const newMode = !currentMode;
        localStorage.setItem('DEMO_MODE', newMode);
        alert(`Demo Mode is now ${newMode ? 'ON (Mock Data)' : 'OFF (Live API)'}`);
        window.location.reload();
    };

    return (
        <div className="relative z-10 min-h-screen overflow-hidden text-text-primary">
            <div className="relative">
                {/* Top bar */}
                <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
                    <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-accent/10 text-accent">
                            <span className="font-mono text-xs font-bold">CA</span>
                        </div>
                        <span className="text-[13px] font-semibold tracking-wide">CODEARCHAEOLOGIST</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Button variant="secondary" size="sm" onClick={() => navigate("/analyze")}>
                            Investigate a Repository
                        </Button>
                    </div>
                </header>

                {/* Hero */}
                <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 pb-24 pt-12 lg:grid-cols-2">
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
                            Engineering intelligence, reconstructed
                        </p>
                        {/* Hidden Toggle attached here */}
                        <h1 
                            onDoubleClick={handleToggleDemo}
                            title="Double-click to toggle Demo Mode"
                            className="mt-4 cursor-pointer select-none text-4xl font-semibold leading-tight text-text-primary lg:text-5xl"
                        >
                            Discover Why Your Code Exists.
                        </h1>
                        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-text-muted">
                            CodeArchaeologist reconstructs the decisions, dependencies and historical context buried
                            inside your GitHub repositories.
                        </p>
                        <div className="mt-8 flex items-center gap-3">
                            <Button size="lg" icon={TbArrowRight} iconPosition="right" onClick={() => navigate("/analyze")}>
                                Investigate a Repository
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="rounded-xl border border-border bg-surface p-6"
                    >
                        <p className="mb-6 font-mono text-[11px] uppercase tracking-widest text-text-faint">
                            Investigation path
                        </p>
                        <div className="flex flex-col gap-0">
                            {investigationSteps.map((step, i) => (
                                <div key={step.label}>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface-elevated text-accent">
                                            <step.icon size={14} />
                                        </div>
                                        <span className="font-mono text-xs tracking-wide text-text-primary">{step.label}</span>
                                        <span className="ml-auto font-mono text-[10px] text-text-faint">
                                            {i === 0 && "184 files"}
                                            {i === 1 && "2,431 indexed"}
                                            {i === 2 && "73 linked"}
                                            {i === 3 && "91% confidence"}
                                            {i === 4 && "3 sources"}
                                        </span>
                                    </div>
                                    {i < investigationSteps.length - 1 && (
                                        <div className="ml-4 h-6 w-px bg-border" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* Problem */}
                <section className="border-t border-border-subtle bg-surface/40 px-6 py-20">
                    <div className="mx-auto max-w-3xl text-center">
                        <p className="font-mono text-[11px] uppercase tracking-widest text-evidence">The problem</p>
                        <h2 className="mt-3 text-2xl font-semibold text-text-primary">
                            Modern code tells you what it does — rarely why.
                        </h2>
                        <p className="mt-4 text-sm leading-relaxed text-text-muted">
                            Every workaround, fallback, and unusual pattern in a mature codebase started as a
                            reasonable decision. That reasoning gets buried across commits, closed issues, and pull
                            requests — until nobody on the team can explain why the code still looks the way it does.
                        </p>
                    </div>
                </section>

                {/* How it works */}
                <section className="px-6 py-20">
                    <div className="mx-auto max-w-6xl">
                        <p className="font-mono text-[11px] uppercase tracking-widest text-accent">How it works</p>
                        <h2 className="mt-3 text-2xl font-semibold text-text-primary">One continuous investigation.</h2>
                        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-5">
                            {["Repository", "Agents", "Evidence", "Reasoning", "Insight"].map((step, i) => (
                                <div key={step} className="rounded-lg border border-border bg-surface p-4">
                                    <span className="font-mono text-[11px] text-text-faint">{String(i + 1).padStart(2, "0")}</span>
                                    <p className="mt-2 text-sm font-medium text-text-primary">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Agents */}
                <section className="border-t border-border-subtle px-6 py-20">
                    <div className="mx-auto max-w-6xl">
                        <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
                            Multi-agent architecture
                        </p>
                        <h2 className="mt-3 text-2xl font-semibold text-text-primary">
                            Specialized agents, one evidence graph.
                        </h2>
                        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {agents.map((agent) => (
                                <div key={agent.name} className="rounded-lg border border-border bg-surface p-5">
                                    <p className="text-sm font-medium text-text-primary">{agent.name}</p>
                                    <p className="mt-2 text-xs leading-relaxed text-text-muted">{agent.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Decision Forensics preview */}
                <section className="border-t border-border-subtle bg-surface/40 px-6 py-20">
                    <div className="mx-auto max-w-4xl">
                        <p className="font-mono text-[11px] uppercase tracking-widest text-evidence">
                            Decision forensics
                        </p>
                        <h2 className="mt-3 text-2xl font-semibold text-text-primary">
                            Reconstruct the reasoning behind the code.
                        </h2>
                        <div className="mt-8 rounded-xl border border-border bg-surface p-6">
                            <p className="font-mono text-xs text-text-faint">PaymentService</p>
                            <p className="mt-2 text-base font-medium text-text-primary">
                                Why does PaymentService still use LegacyPaymentFallback?
                            </p>
                            <p className="mt-4 text-sm leading-relaxed text-text-muted">
                                LegacyPaymentFallback was introduced during the 2021 payment-provider migration to
                                handle timeout failures.
                            </p>
                            <div className="mt-5 flex flex-wrap gap-3 font-mono text-[11px] text-text-faint">
                                <span className="rounded border border-border px-2 py-1">Commit a81f2e9</span>
                                <span className="rounded border border-border px-2 py-1">PR #142</span>
                                <span className="rounded border border-border px-2 py-1">Issue #89</span>
                                <span className="rounded border border-success/30 bg-success/10 px-2 py-1 text-success">
                                    91% confidence
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="px-6 py-24 text-center">
                    <h2 className="text-2xl font-semibold text-text-primary">
                        Your repository has a history worth understanding.
                    </h2>
                    <div className="mt-8">
                        <Button size="lg" icon={TbArrowRight} iconPosition="right" onClick={() => navigate("/analyze")}>
                            Investigate a Repository
                        </Button>
                    </div>
                </section>

                <footer className="border-t border-border-subtle px-6 py-8 text-center text-[11px] text-text-faint">
                    CodeArchaeologist — engineering intelligence, reconstructed.
                </footer>
            </div>
        </div>
    );
}