import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import Timeline from "../components/Timeline.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { TbHistory } from "react-icons/tb";
import { getTimeline } from "../services/api.js";

export default function EvolutionTimeline() {
    const { id } = useParams();
    const [events, setEvents] = useState(null);

    useEffect(() => {
        getTimeline(id).then(setEvents);
    }, [id]);

    if (!events) return <LoadingState messages={["Tracing historical decisions...", "Reconstructing intent..."]} />;

    return (
        <div className="flex flex-col gap-8 pb-16">
            <PageHeader
                eyebrow="Evolution Timeline"
                title="How this repository became what it is"
                subtitle="Reconstructed from commit history, issues and pull requests."
            />
            {events.length === 0 ? (
                <EmptyState icon={TbHistory} title="No historical events found" description="This investigation did not surface any significant events." />
            ) : (
                <Timeline events={events} />
            )}
        </div>
    );
}