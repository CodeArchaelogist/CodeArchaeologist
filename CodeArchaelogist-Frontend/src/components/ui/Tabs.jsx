import clsx from "clsx";

export default function Tabs({ tabs, active, onChange }) {
    return (
        <div role="tablist" className="flex gap-1 border-b border-border">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    role="tab"
                    aria-selected={active === tab.id}
                    onClick={() => onChange(tab.id)}
                    className={clsx(
                        "focus-ring relative px-3 py-2.5 text-xs font-medium transition-colors",
                        active === tab.id ? "text-text-primary" : "text-text-muted hover:text-text-primary"
                    )}
                >
                    {tab.label}
                    {active === tab.id && (
                        <span className="absolute inset-x-0 -bottom-px h-px bg-accent" />
                    )}
                </button>
            ))}
        </div>
    );
}