import { TbGitCommit, TbGitPullRequest, TbCircleDot } from "react-icons/tb";

const typeConfig = {
    commit: { icon: TbGitCommit, color: "text-accent" },
    pr: { icon: TbGitPullRequest, color: "text-success" },
    issue: { icon: TbCircleDot, color: "text-evidence" },
};

export default function EvidenceCard({ evidence, onClick }) {
    const config = typeConfig[evidence?.type] || typeConfig.commit;
    const Icon = config.icon;

    return (
        <button
            onClick={onClick}
            className="focus-ring flex w-full items-center gap-3 rounded-md border border-border bg-surface px-3 py-2.5 text-left transition-colors hover:border-accent/30"
        >
            <Icon size={15} className={config.color} />
            <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-text-primary">{evidence?.label}</p>
            </div>
            <span className="font-mono text-[10px] text-text-faint">{evidence?.ref}</span>
        </button>
    );
}