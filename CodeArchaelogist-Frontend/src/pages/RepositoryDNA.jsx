import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import DependencyGraph from "../components/DependencyGraph.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import { getArchitecture } from "../services/api.js";

export default function RepositoryDNA() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [selectedNode, setSelectedNode] = useState("PaymentService");

    useEffect(() => {
        getArchitecture(id).then(setData);
    }, [id]);

    if (!data) return <LoadingState />;

    const { architecture, dependencyGraph, nodeDetails } = data;

    if (!architecture || Array.isArray(architecture) || Object.keys(architecture).length === 0) {
        return <div className="text-center py-12 text-text-muted">No architecture data available.</div>;
    }

    const detail = nodeDetails?.[selectedNode];

    return (
        <div className="flex flex-col gap-8 pb-16">
            <PageHeader eyebrow="Repository DNA" title="What this repository is made of" />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <InfoBlock label="Architecture" value={architecture?.style} />
                <InfoBlock label="Size" value={architecture?.size} />
                <InfoBlock label="Stack" value={architecture?.framework} />
                <InfoBlock label="Entry points" value={(architecture?.entryPoints || []).join(", ")} mono />
            </div>

            <div>
                <p className="mb-3 text-sm font-semibold text-text-primary">Key Modules</p>
                <div className="overflow-hidden rounded-lg border border-border">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-surface-elevated text-[11px] uppercase tracking-wide text-text-faint">
                            <tr>
                                <th className="px-4 py-2.5 font-medium">Module</th>
                                <th className="px-4 py-2.5 font-medium">Files</th>
                                <th className="px-4 py-2.5 font-medium">Risk</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle">
                            {(architecture?.keyModules || []).map((mod) => (
                                <tr
                                    key={mod?.name}
                                    className="cursor-pointer bg-surface hover:bg-surface-elevated/60"
                                    onClick={() => setSelectedNode(mod?.name)}
                                >
                                    <td className="px-4 py-2.5 font-mono text-text-primary">{mod?.name}</td>
                                    <td className="px-4 py-2.5 text-text-muted">{mod?.files}</td>
                                    <td className="px-4 py-2.5">
                                        <StatusBadge label={mod?.risk} tone={mod?.risk} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <p className="mb-3 text-sm font-semibold text-text-primary">Dependency Graph</p>
                    <DependencyGraph graph={dependencyGraph} nodeDetails={nodeDetails} onSelectNode={setSelectedNode} />
                </div>

                <div className="rounded-lg border border-border bg-surface p-5">
                    <p className="font-mono text-sm text-text-primary">{selectedNode}</p>
                    {detail && (
                        <>
                            <p className="mt-2 text-xs leading-relaxed text-text-muted">{detail.description}</p>
                            <div className="mt-4 flex flex-col divide-y divide-border-subtle text-sm">
                                <Row label="Files" value={detail.files} />
                                <Row label="Dependents" value={detail.dependents} />
                                <Row label="Dependencies" value={detail.dependencies} />
                                <Row label="Historical Events" value={detail.historicalEvents} />
                            </div>
                            <div className="mt-4">
                                <StatusBadge label={detail.risk} tone={detail.risk} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function InfoBlock({ label, value, mono }) {
    return (
        <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-[11px] uppercase tracking-wide text-text-faint">{label}</p>
            <p className={`mt-1.5 text-sm text-text-primary ${mono ? "font-mono text-xs" : ""}`}>{value}</p>
        </div>
    );
}

function Row({ label, value }) {
    return (
        <div className="flex items-center justify-between py-2">
            <span className="text-text-muted">{label}</span>
            <span className="font-mono text-text-primary">{value}</span>
        </div>
    );
}