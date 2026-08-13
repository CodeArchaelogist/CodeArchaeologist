import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import AgentPipeline from "../components/AgentPipeline.jsx";
import InvestigationProgress from "../components/InvestigationProgress.jsx";
import { getInvestigation } from "../services/api.js";
import BackButton from "../components/ui/BackButton.jsx";

export default function Investigation() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);

    useEffect(() => {
        getInvestigation(id).then(setData);
    }, [id]);

    useEffect(() => {
        if (!data) return;
        const timer = setTimeout(() => navigate(`/dashboard/${id}`), 4200);
        return () => clearTimeout(timer);
    }, [data, id, navigate]);

    if (!data) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-void">
                <p className="font-mono text-xs text-text-muted">Initializing investigation...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-void px-6 py-10">
            <div className="mx-auto max-w-5xl">
                <div className="flex items-center justify-between border-b border-border-subtle pb-5">
                    <div>
                        <BackButton className="mb-3" />
                        <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
                            Investigation {id}
                        </p>
                        <h1 className="mt-1 text-xl font-semibold text-text-primary">
                            {data.repository.fullName}
                        </h1>
                    </div>
                    <span className="font-mono text-xs text-text-faint">{data.repository.branch}</span>
                </div>

                <div className="mt-6">
                    <InvestigationProgress percent={64} stage="Dependency Agent — mapping relationships" />
                </div>

                <div className="mt-8">
                    <p className="mb-3 text-sm font-semibold text-text-primary">Agent Pipeline</p>
                    <AgentPipeline agents={data.agentPipeline} />
                </div>

                <div className="mt-8 rounded-lg border border-border bg-surface p-4">
                    <p className="mb-3 text-sm font-semibold text-text-primary">Investigation Log</p>
                    <div className="flex flex-col gap-2 font-mono text-xs">
                        {data.investigationLog.map((entry, i) => (
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
            </div>
        </div>
    );
}