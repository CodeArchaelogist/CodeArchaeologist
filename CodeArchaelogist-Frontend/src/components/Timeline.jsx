import { motion } from "framer-motion";
import TimelineEvent from "./TimelineEvent.jsx";

export default function Timeline({ events }) {
    return (
        <div className="relative pl-6">
            <div className="evidence-trail absolute left-[7px] top-1 bottom-1 w-px" />
            <div className="flex flex-col gap-6">
                {events.map((event, i) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.35, delay: i * 0.04 }}
                    >
                        <TimelineEvent event={event} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}