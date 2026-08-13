import { motion } from "framer-motion";
import AgentCard from "./AgentCard.jsx";

export default function AgentPipeline({ agents }) {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {agents.map((agent, i) => (
                <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                >
                    <AgentCard agent={agent} />
                </motion.div>
            ))}
        </div>
    );
}