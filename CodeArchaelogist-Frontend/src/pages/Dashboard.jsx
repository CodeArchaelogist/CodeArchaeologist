import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TbRefresh, TbBrandGithub } from "react-icons/tb";
import PageHeader from "../components/PageHeader.jsx";
import MetricCard from "../components/MetricCard.jsx";
import RepositoryHealth from "../components/RepositoryHealth.jsx";
import RiskCard from "../components/RiskCard.jsx";
import Timeline from "../components/Timeline.jsx";
import DecisionCard from "../components/DecisionCard.jsx";
import Button from "../components/ui/Button.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import { getRepository, getRisks, getTimeline, getDecisions } from "../services/api.js";

export default function Dashboard() {
    const { id } = useParams();
    const [repo, setRepo] = useState(null);
    const [risks, setRisks] = useState([]);
    const [events, setEvents] = useState([]);
    const [decisions, setDecisions] = useState([]);

    useEffect(() => {
        getRepository(id).then(setRepo);
        getRisks(id).then((r) => setRisks(r.filter((x) => x.level === "HIGH").slice(0, 2)));
        getTimeline(id).then((t) => setEvents(t.slice(-3)));
        getDecisions(id).then((d) => setDecisions(d.slice(0, 2)));
    }, [id]);

    if (!repo) return <LoadingState />;

    return (
        <div className="flex flex-col gap-8 pb-16">
            <PageHeader
                eyebrow="Overview"
                title={repo?.fullName}
                subtitle={`Branch ${repo?.branch || ""} · Last analyzed ${repo?.lastAnalyzed ? new Date(repo.lastAnalyzed).toLocaleString() : "Never"}`}
                actions={
                    <>
                        <Button variant="secondary" size="sm" icon={TbBrandGithub} onClick={() => repo?.url && window.open(repo.url, "_blank")}>
                            GitHub
                        </Button>
                        <Button size="sm" icon={TbRefresh}>Re-analyze</Button>
                    </>
                }
            />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                <MetricCard label="Files" value={repo?.stats?.files ?? (repo?.files || []).length} />
                <MetricCard label="Commits" value={repo?.stats?.commits?.toLocaleString() || "0"} />
                <MetricCard label="Issues" value={repo?.stats?.issues || 0} />
                <MetricCard label="Pull Requests" value={repo?.stats?.pullRequests || 0} />
                <MetricCard label="Dependencies" value={repo?.stats?.dependencies || 0} />
                <MetricCard label="Risk Score" value={repo?.stats?.riskScore || 0} tone="danger" />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <RepositoryHealth stats={repo?.stats} />
                </div>
                <div className="rounded-lg border border-border bg-surface p-5">
                    <p className="text-sm font-semibold text-text-primary">Languages</p>
                    <div className="mt-4 flex flex-col gap-3">
                        {(repo?.languages || []).map((lang) => (
                            <div key={lang.name}>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-text-muted">{lang.name}</span>
                                    <span className="font-mono text-text-faint">{lang.percent}%</span>
                                </div>
                                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-elevated">
                                    <div
                                        className="h-full rounded-full"
                                        style={{ width: `${lang.percent}%`, backgroundColor: lang.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <p className="mb-4 text-sm font-semibold text-text-primary">Recent Historical Events</p>
                <Timeline events={events} />
            </div>

            <div>
                <p className="mb-4 text-sm font-semibold text-text-primary">Risk Hotspots</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {risks.map((r) => (
                        <RiskCard key={r.id} risk={r} onClick={() => { }} />
                    ))}
                </div>
            </div>

            <div>
                <p className="mb-4 text-sm font-semibold text-text-primary">Historical Decisions</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {decisions.map((d) => (
                        <DecisionCard key={d.id} decision={d} />
                    ))}
                </div>
            </div>
        </div>
    );
}