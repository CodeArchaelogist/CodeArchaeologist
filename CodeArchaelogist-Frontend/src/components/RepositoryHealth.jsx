export default function RepositoryHealth({ stats }) {
    const items = [
        { label: "Test coverage signal", value: "Moderate", tone: "text-evidence" },
        { label: "Documentation coverage", value: "Sparse", tone: "text-danger" },
        { label: "Dependency freshness", value: "1 legacy SDK flagged", tone: "text-danger" },
        { label: "Ownership clarity", value: "Clear — 6 active maintainers", tone: "text-success" },
    ];

    return (
        <div className="rounded-lg border border-border bg-surface p-5">
            <p className="text-sm font-semibold text-text-primary">Repository Health</p>
            <div className="mt-4 flex flex-col divide-y divide-border-subtle">
                {items.map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2.5 text-sm">
                        <span className="text-text-muted">{item.label}</span>
                        <span className={`font-medium ${item.tone}`}>{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}