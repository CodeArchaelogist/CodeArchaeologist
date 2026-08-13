export default function MetricCard({ label, value, suffix, tone = "default" }) {
    const toneClass =
        tone === "danger" ? "text-danger" : tone === "evidence" ? "text-evidence" : "text-text-primary";

    return (
        <div className="rounded-lg border border-border bg-surface px-4 py-3.5">
            <p className="text-[11px] uppercase tracking-wide text-text-faint">{label}</p>
            <p className={`mt-1.5 font-mono text-2xl font-semibold ${toneClass}`}>
                {value}
                {suffix && <span className="ml-1 text-sm text-text-muted">{suffix}</span>}
            </p>
        </div>
    );
}