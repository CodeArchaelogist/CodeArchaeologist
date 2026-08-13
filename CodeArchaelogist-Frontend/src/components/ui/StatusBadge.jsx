import clsx from "clsx";

const tones = {
    HIGH: "text-danger bg-danger/10 border-danger/30",
    MEDIUM: "text-evidence bg-evidence/10 border-evidence/30",
    LOW: "text-success bg-success/10 border-success/30",
    complete: "text-success bg-success/10 border-success/30",
    active: "text-accent bg-accent/10 border-accent/30",
    pending: "text-text-faint bg-surface-elevated border-border",
    FINDING: "text-evidence bg-evidence/10 border-evidence/30",
    MILESTONE: "text-accent bg-accent/10 border-accent/30",
    MAJOR: "text-text-primary bg-surface-elevated border-border",
    MINOR: "text-text-muted bg-surface-elevated border-border",
};

export default function StatusBadge({ label, tone = "pending", className }) {
    return (
        <span
            className={clsx(
                "inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
                tones[tone] || tones.pending,
                className
            )}
        >
            {label}
        </span>
    );
}