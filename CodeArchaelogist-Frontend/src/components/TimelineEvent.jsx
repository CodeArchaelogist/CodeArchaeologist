import StatusBadge from "./ui/StatusBadge.jsx";

export default function TimelineEvent({ event }) {
    return (
        <div className="relative">
            <span className="absolute -left-6 top-1 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-void bg-accent" />
            <div className="rounded-lg border border-border bg-surface p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-text-faint">{event?.date}</span>
                        <StatusBadge label={event?.importance} tone={event?.importance} />
                    </div>
                    {event?.commit && (
                        <span className="font-mono text-[11px] text-text-faint">{event?.commit}</span>
                    )}
                </div>

                <p className="mt-2 text-sm font-medium text-text-primary">{event?.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-text-muted">{event?.description}</p>

                <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-text-faint">
                    {event?.author && <span>by {event?.author}</span>}
                    {(event?.filesAffected || 0) > 0 && <span>{event?.filesAffected} files affected</span>}
                    {event?.relatedPR && <span className="text-success">{event?.relatedPR}</span>}
                    {event?.relatedIssue && <span className="text-evidence">{event?.relatedIssue}</span>}
                </div>
            </div>
        </div>
    );
}