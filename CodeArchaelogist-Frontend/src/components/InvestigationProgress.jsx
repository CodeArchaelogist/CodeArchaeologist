import { motion } from "framer-motion";

export default function InvestigationProgress({ percent, stage }) {
    return (
        <div className="rounded-lg border border-border bg-surface p-5">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[11px] uppercase tracking-wide text-text-faint">Current stage</p>
                    <p className="mt-1 text-sm font-medium text-text-primary">{stage}</p>
                </div>
                <p className="font-mono text-2xl font-semibold text-accent">{percent}%</p>
            </div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-elevated">
                <motion.div
                    className="h-full rounded-full bg-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />
            </div>
        </div>
    );
}