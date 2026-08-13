export default function ConfidenceScore({ value }) {
    const tone = value >= 80 ? "text-success" : value >= 55 ? "text-evidence" : "text-danger";
    const track = value >= 80 ? "bg-success" : value >= 55 ? "bg-evidence" : "bg-danger";

    return (
        <div>
            <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wide text-text-faint">Confidence</span>
                <span className={`font-mono text-sm font-semibold ${tone}`}>{value}%</span>
            </div>
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-surface-elevated">
                <div className={`h-full rounded-full ${track}`} style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}