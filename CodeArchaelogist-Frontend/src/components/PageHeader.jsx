import BackButton from "./ui/BackButton.jsx";

export default function PageHeader({ eyebrow, title, subtitle, actions }) {
    return (
        <div className="flex flex-col gap-4 border-b border-border-subtle pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
                <BackButton className="mb-3" />
                {eyebrow && (
                    <p className="mb-1.5 font-mono text-[11px] uppercase tracking-widest text-accent">
                        {eyebrow}
                    </p>
                )}
                <h1 className="truncate text-xl font-semibold text-text-primary">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-text-muted">{subtitle}</p>}
            </div>
            {actions && (
                <div className="flex flex-wrap items-center gap-2 sm:shrink-0">{actions}</div>
            )}
        </div>
    );
}