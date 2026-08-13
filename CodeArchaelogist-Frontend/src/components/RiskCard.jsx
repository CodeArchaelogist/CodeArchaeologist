import StatusBadge from "./ui/StatusBadge.jsx";
import { TbAlertTriangle } from "react-icons/tb";

export default function RiskCard({ risk, onClick }) {
    return (
        <button
            onClick={onClick}
            className="focus-ring w-full rounded-lg border border-border bg-surface p-4 text-left transition-colors hover:border-accent/30"
        >
            <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-medium text-text-primary">{risk.component}</span>
                <StatusBadge label={risk.level} tone={risk.level} />
            </div>

            <p className="mt-2 text-xs text-text-muted">{risk.summary}</p>

            <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-text-faint">
                <span>{risk.dependents} dependents</span>
                <span>{risk.historicalFixes} historical fixes</span>
                {risk.legacyDependency && (
                    <span className="flex items-center gap-1 text-danger">
                        <TbAlertTriangle size={11} /> legacy dependency
                    </span>
                )}
                {risk.documentationMissing && <span className="text-evidence">documentation missing</span>}
            </div>
        </button>
    );
}