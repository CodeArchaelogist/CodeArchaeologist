export default function EmptyState({ icon: Icon, title, description, action }) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
            {Icon && (
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface-elevated text-text-faint">
                    <Icon size={18} strokeWidth={1.5} />
                </div>
            )}
            <p className="text-sm font-medium text-text-primary">{title}</p>
            {description && <p className="max-w-sm text-xs text-text-muted">{description}</p>}
            {action}
        </div>
    );
}