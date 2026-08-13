import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import ConfidenceScore from "../components/ConfidenceScore.jsx";
import EvidenceList from "../components/EvidenceList.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import Timeline from "../components/Timeline.jsx";
import { getDecisions, getTimeline } from "../services/api.js";

export default function DecisionForensics() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const [decisions, setDecisions] = useState(null);
    const [events, setEvents] = useState([]);
    const [activeId, setActiveId] = useState(null);

    useEffect(() => {
        getDecisions(id).then((d) => {
            setDecisions(d);
            const preselect = searchParams.get("component");
            const match = preselect ? d.find((x) => x.component === preselect) : d[0];
            setActiveId((match || d[0])?.id);
        });
        getTimeline(id).then((t) => setEvents(t.slice(1, 4)));
    }, [id, searchParams]);

    if (!decisions) return <LoadingState messages={["Reconstructing intent...", "Connecting evidence..."]} />;

    const active = decisions.find((d) => d.id === activeId) || decisions[0];

    return (
        <div className="flex flex-col gap-8 pb-16">
            <PageHeader eyebrow="Decision Forensics" title="Reconstruct the reasoning behind the code." />

            <div className="flex gap-2 overflow-x-auto pb-1">
                {decisions.map((d) => (
                    <button
                        key={d.id}
                        onClick={() => setActiveId(d.id)}
                        className={`focus-ring shrink-0 rounded-md border px-3 py-1.5 font-mono text-xs transition-colors ${active.id === d.id
                                ? "border-accent/40 bg-accent/10 text-accent"
                                : "border-border text-text-muted hover:text-text-primary"
                            }`}
                    >
                        {d.component}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr_1fr]">
                {/* LEFT — historical timeline */}
                <div>
                    <p className="mb-3 text-sm font-semibold text-text-primary">Historical Timeline</p>
                    <Timeline events={events} />
                </div>

                {/* CENTER — AI reconstructed explanation */}
                <div className="rounded-lg border border-border bg-surface p-6">
                    <p className="font-mono text-xs text-text-faint">{active.component}</p>
                    <p className="mt-2 text-lg font-medium text-text-primary">{active.question}</p>

                    <div className="mt-5">
                        <p className="text-[11px] uppercase tracking-wide text-evidence">Historical Intent</p>
                        <p className="mt-2 text-sm leading-relaxed text-text-muted">{active.historicalIntent}</p>
                    </div>

                    <div className="mt-6 rounded-md border border-accent/20 bg-accent/5 p-4">
                        <p className="text-[11px] uppercase tracking-wide text-accent">Recommendation</p>
                        <p className="mt-2 text-sm leading-relaxed text-text-primary">{active.recommendation}</p>
                    </div>
                </div>

                {/* RIGHT — evidence + confidence + risk */}
                <div className="flex flex-col gap-5">
                    <div className="rounded-lg border border-border bg-surface p-4">
                        <ConfidenceScore value={active.confidence} />
                    </div>
                    <div className="rounded-lg border border-border bg-surface p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] uppercase tracking-wide text-text-faint">Risk</span>
                            <StatusBadge label={active.risk} tone={active.risk} />
                        </div>
                        <div className="mt-3 flex items-center justify-between text-sm">
                            <span className="text-text-muted">Affected modules</span>
                            <span className="font-mono text-text-primary">{active.affectedModules}</span>
                        </div>
                    </div>
                    <div>
                        <p className="mb-2 text-[11px] uppercase tracking-wide text-text-faint">Evidence</p>
                        <EvidenceList evidence={active.evidence} />
                    </div>
                </div>
            </div>
        </div>
    );
}