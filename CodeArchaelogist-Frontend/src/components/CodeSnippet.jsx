export default function CodeSnippet({ path, lines = [] }) {
    return (
        <div className="overflow-hidden rounded-md border border-border bg-void">
            <div className="border-b border-border px-3 py-1.5 font-mono text-[11px] text-text-faint">
                {path}
            </div>
            <pre className="overflow-x-auto px-3 py-2.5 font-mono text-[12px] leading-relaxed text-text-muted">
                {lines.map((line, i) => (
                    <div key={i} className="flex gap-3">
                        <span className="select-none text-text-faint/60">{String(i + 1).padStart(2, "0")}</span>
                        <span>{line}</span>
                    </div>
                ))}
            </pre>
        </div>
    );
}