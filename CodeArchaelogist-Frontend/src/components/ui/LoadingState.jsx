import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function LoadingState({
    messages = ["Excavating repository...", "Mapping architecture...", "Tracing historical decisions...", "Connecting evidence..."],
    compact = false,
}) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((i) => (i + 1) % messages.length);
        }, 1600);
        return () => clearInterval(interval);
    }, [messages.length]);

    if (compact) {
        return (
            <div className="flex items-center gap-2 text-xs text-text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulseDot" />
                <span>{messages[index]}</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4 py-24">
            <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                    <span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-accent animate-pulseDot"
                        style={{ animationDelay: `${i * 0.2}s` }}
                    />
                ))}
            </div>
            <motion.p
                key={index}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="font-mono text-sm text-text-muted"
            >
                {messages[index]}
            </motion.p>
        </div>
    );
}