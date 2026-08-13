import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    ZAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import PageHeader from "../components/PageHeader.jsx";
import MetricCard from "../components/MetricCard.jsx";
import RiskCard from "../components/RiskCard.jsx";
import Modal from "../components/ui/Modal.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import { getRisks, getRepository } from "../services/api.js";

const riskColor = { HIGH: "#F0554A", MEDIUM: "#D9A441", LOW: "#3FCB8A" };

export default function RiskImpact() {
    const { id } = useParams();
    const [risks, setRisks] = useState(null);
    const [repo, setRepo] = useState(null);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        getRisks(id).then(setRisks);
        getRepository(id).then(setRepo);
    }, [id]);

    if (!risks || !repo) return <LoadingState messages={["Mapping architecture...", "Tracing historical decisions..."]} />;

    const highCount = risks.filter((r) => r.level === "HIGH").length;

    return (
        <div className="flex flex-col gap-8 pb-16">
            <PageHeader eyebrow="Risk & Impact" title="Where change is dangerous, and why." />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <MetricCard label="Overall Risk Score" value={repo.stats.riskScore} tone="danger" />
                <MetricCard label="High-risk Components" value={highCount} tone="danger" />
                <MetricCard label="Legacy Dependencies" value={risks.filter((r) => r.legacyDependency).length} tone="evidence" />
                <MetricCard label="Undocumented Areas" value={risks.filter((r) => r.documentationMissing).length} tone="evidence" />
            </div>

            <div>
                <p className="mb-3 text-sm font-semibold text-text-primary">Impact Matrix</p>
                <div className="rounded-lg border border-border bg-surface p-5">
                    <ResponsiveContainer width="100%" height={340}>
                        <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                            <CartesianGrid stroke="#1E2530" />
                            <XAxis
                                type="number"
                                dataKey="likelihood"
                                name="Likelihood"
                                domain={[0, 10]}
                                stroke="#5B6474"
                                tick={{ fontSize: 11, fill: "#8A93A3" }}
                                label={{ value: "Likelihood", position: "insideBottom", offset: -5, fill: "#5B6474", fontSize: 11 }}
                            />
                            <YAxis
                                type="number"
                                dataKey="impact"
                                name="Impact"
                                domain={[0, 10]}
                                stroke="#5B6474"
                                tick={{ fontSize: 11, fill: "#8A93A3" }}
                                label={{ value: "Impact", angle: -90, position: "insideLeft", fill: "#5B6474", fontSize: 11 }}
                            />
                            <ZAxis range={[80, 80]} />
                            <Tooltip
                                cursor={{ strokeDasharray: "3 3", stroke: "#3FD0FF" }}
                                contentStyle={{ background: "#141A24", border: "1px solid #1E2530", borderRadius: 6, fontSize: 12 }}
                                labelStyle={{ color: "#EDF0F5" }}
                                formatter={(value, name) => [value, name]}
                            />
                            <Scatter
                                data={risks}
                                shape={(props) => (
                                    <circle
                                        cx={props.cx}
                                        cy={props.cy}
                                        r={6}
                                        fill={riskColor[props.payload.level]}
                                        fillOpacity={0.85}
                                    />
                                )}
                            />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div>
                <p className="mb-3 text-sm font-semibold text-text-primary">Risk Hotspots</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {risks.map((r) => (
                        <RiskCard key={r.id} risk={r} onClick={() => setSelected(r)} />
                    ))}
                </div>
            </div>

            <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.component}>
                {selected && (
                    <div className="flex flex-col gap-4 text-sm">
                        <div className="flex items-center justify-between">
                            <StatusBadge label={selected.level} tone={selected.level} />
                            <span className="font-mono text-xs text-text-faint">
                                {selected.dependents} dependents
                            </span>
                        </div>
                        <p className="text-text-muted">{selected.summary}</p>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <InfoRow label="Historical fixes" value={selected.historicalFixes} />
                            <InfoRow label="Legacy dependency" value={selected.legacyDependency ? "Yes" : "No"} />
                            <InfoRow label="Documentation" value={selected.documentationMissing ? "Missing" : "Present"} />
                            <InfoRow label="Likelihood / Impact" value={`${selected.likelihood} / ${selected.impact}`} />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="rounded-md border border-border-subtle bg-surface-elevated px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-text-faint">{label}</p>
            <p className="mt-1 text-text-primary">{value}</p>
        </div>
    );
}