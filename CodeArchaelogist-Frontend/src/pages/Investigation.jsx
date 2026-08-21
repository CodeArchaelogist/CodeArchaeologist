import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import AgentPipeline from "../components/AgentPipeline.jsx";
import InvestigationProgress from "../components/InvestigationProgress.jsx";
import { getInvestigation } from "../services/api.js";
import BackButton from "../components/ui/BackButton.jsx";
import ThemeToggle from "../components/ui/ThemeToggle.jsx";
import Button from "../components/ui/Button.jsx";
import { TbArrowRight } from "react-icons/tb";

export default function Investigation() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        getInvestigation(id)
            .then((res) => {
                setData(res);
            })
            .catch((err) => {
                setError(err.message || "Failed to load investigation data.");
            });
    }, [id]);

    useEffect(() => {
        if (!data) return;
        const timer = setTimeout(() => navigate(`/dashboard/${id}`), 2800);
        return () => clearTimeout(timer);
    }, [data, id, navigate]);

    if (error) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-void px-6">
                <p className="text-sm text-danger">{error}</p>
                <Button className="mt-4" onClick={() => navigate("/analyze")}>
                    Back to New Investigation
                </Button>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-void">
                <p className="font-mono text-xs text-text-muted">Initializing archaeological investigation...</p>
            </div>
        );
    }

    const repoName = data.repository?.fullName || data.repository?.name || `Investigation ${id}`;
    const branch = data.repository?.branch || "main";
    const pipeline = data.agentPipeline || [];
    const logs = data.investigationLog || [];

    return (
        <div className="min-h-screen bg-void px-6 py-10">
            <div className="mx-auto max-w-5xl">
                <div className="flex items-start justify-between border-b border-border-subtle pb-5">
                    <div>
                        <BackButton className="mb-3" />
                        <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
                            Investigation {id?.slice(0, 10)}
                        </p>
                        <h1 className="mt-1 text-xl font-semibold text-text-primary">
                            {repoName}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-text-faint">{branch}</span>
                        <ThemeToggle />
                        <Button size="sm" icon={TbArrowRight} iconPosition="right" onClick={() => navigate(`/dashboard/${id}`)}>
                            View Dashboard
                        </Button>
                    </div>
                </div>

                <div className="mt-6">
                    <InvestigationProgress percent={100} stage="Multi-agent evidence synthesis complete" />
                </div>

                <div className="mt-8">
                    <p className="mb-3 text-sm font-semibold text-text-primary">Agent Pipeline</p>
                    <AgentPipeline agents={pipeline} />
                </div>

                {logs.length > 0 && (
                    <div className="mt-8 rounded-lg border border-border bg-surface p-4">
                        <p className="mb-3 text-sm font-semibold text-text-primary">Investigation Log</p>
                        <div className="flex flex-col gap-2 font-mono text-xs">
                            {logs.map((entry, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -6 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    className="flex gap-3 text-text-muted"
                                >
                                    <span className="text-text-faint">{entry.time}</span>
                                    <span>—</span>
                                    <span>{entry.message}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}