import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { TbSend, TbSearch } from "react-icons/tb";
import PageHeader from "../components/PageHeader.jsx";
import ConfidenceScore from "../components/ConfidenceScore.jsx";
import EvidenceList from "../components/EvidenceList.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import Button from "../components/ui/Button.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import { askArchaeologist, getSuggestedQuestions } from "../services/api.js";

export default function AskArchaeologist() {
    const { id } = useParams();
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const suggestions = getSuggestedQuestions();

    const submit = async (q) => {
        const query = q ?? question;
        if (!query.trim()) return;
        setQuestion(query);
        setLoading(true);
        setResponse(null);
        const res = await askArchaeologist(id, query);
        setResponse(res);
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-8 pb-16">
            <PageHeader
                eyebrow="Investigation Console"
                title="Ask CodeArchaeologist"
                subtitle="Investigate the history and behavior of your repository."
            />

            <div className="rounded-lg border border-border bg-surface p-2">
                <div className="flex items-center gap-2">
                    <div className="flex flex-1 items-center gap-2 rounded-md border border-border bg-void px-3 py-2.5">
                        <TbSearch size={15} className="text-text-faint" />
                        <input
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && submit()}
                            placeholder="Why does this function exist?"
                            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-faint focus:outline-none"
                        />
                    </div>
                    <Button icon={TbSend} onClick={() => submit()} disabled={loading}>
                        Investigate
                    </Button>
                </div>
            </div>

            {!response && !loading && (
                <div>
                    <p className="mb-3 text-[11px] uppercase tracking-wide text-text-faint">Suggested questions</p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {suggestions.map((q) => (
                            <button
                                key={q}
                                onClick={() => submit(q)}
                                className="focus-ring rounded-md border border-border bg-surface px-4 py-3 text-left text-sm text-text-muted transition-colors hover:border-accent/30 hover:text-text-primary"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {loading && (
                <LoadingState messages={["Cross-referencing commits...", "Connecting evidence...", "Reconstructing intent..."]} compact={false} />
            )}

            <AnimatePresence>
                {response && !loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-lg border border-border bg-surface p-6"
                    >
                        <div className="flex items-center justify-between">
                            <p className="font-mono text-xs text-text-faint">{response.component}</p>
                            <StatusBadge label={response.risk} tone={response.risk} />
                        </div>
                        <p className="mt-2 text-base font-medium text-text-primary">{response.question}</p>

                        <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-3">
                            <div className="lg:col-span-2">
                                <p className="text-[11px] uppercase tracking-wide text-evidence">Forensic Report</p>
                                <p className="mt-2 text-sm leading-relaxed text-text-muted">{response.historicalIntent}</p>

                                <div className="mt-5 rounded-md border border-accent/20 bg-accent/5 p-4">
                                    <p className="text-[11px] uppercase tracking-wide text-accent">Recommendation</p>
                                    <p className="mt-2 text-sm leading-relaxed text-text-primary">{response.recommendation}</p>
                                </div>

                                <div className="mt-5 flex items-center justify-between rounded-md border border-border-subtle px-4 py-2.5 text-sm">
                                    <span className="text-text-muted">Affected modules</span>
                                    <span className="font-mono text-text-primary">{response.affectedModules}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-5">
                                <ConfidenceScore value={response.confidence} />
                                <div>
                                    <p className="mb-2 text-[11px] uppercase tracking-wide text-text-faint">Evidence</p>
                                    <EvidenceList evidence={response.evidence} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}