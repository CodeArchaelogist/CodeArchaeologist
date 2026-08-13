import { TbCheck, TbLoader2, TbCircle } from "react-icons/tb";
import clsx from "clsx";

const statusConfig = {
    complete: { icon: TbCheck, color: "text-success", track: "bg-success" },
    active: { icon: TbLoader2, color: "text-accent", track: "bg-accent" },
    pending: { icon: TbCircle, color: "text-text-faint", track: "bg-text-faint" },
};
export default function AgentCard({ agent }) {
    const config = statusConfig[agent.status];
    const Icon = config.icon;

    return (
        <div
            className={clsx(
                "rounded-lg border bg-surface p-4 transition-colors",
                agent.status === "active" ? "border-accent/30" : "border-border"
            )}
        >
            <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wide text-text-faint">
                    {agent.name}
                </span>
                <Icon
                    size={14}
                    className={clsx(config.color, agent.status === "active" && "animate-spin")}
                />
            </div>

            <p className="mt-2 text-sm text-text-primary">{agent.discoveries}</p>
            <p className="mt-1 text-xs text-text-muted">{agent.description}</p>

            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-surface-elevated">
                <div
                    className={clsx("h-full rounded-full transition-all duration-700", config.track)}
                    style={{ width: `${agent.progress}%` }}
                />
            </div>

            {agent.timestamp && (
                <p className="mt-2 font-mono text-[10px] text-text-faint">{agent.timestamp}</p>
            )}
        </div>
    );
}