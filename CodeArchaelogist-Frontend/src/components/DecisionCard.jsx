import { useNavigate, useParams } from "react-router-dom";
import StatusBadge from "./ui/StatusBadge.jsx";
import ConfidenceScore from "./ConfidenceScore.jsx";

export default function DecisionCard({ decision }) {
    const navigate = useNavigate();
    const { id } = useParams();

    if (!decision) return null;

    return (
        <button
            onClick={() => decision?.component && navigate(`/decisions/${id}?component=${decision.component}`)}
            className="focus-ring flex w-full flex-col gap-3 rounded-lg border border-border bg-surface p-4 text-left transition-colors hover:border-accent/30"
        >
            <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-text-muted">{decision?.component}</span>
                <StatusBadge label={decision?.risk} tone={decision?.risk} />
            </div>
            <p className="text-sm font-medium text-text-primary">{decision?.question}</p>
            <ConfidenceScore value={decision?.confidence} />
        </button>
    );
}