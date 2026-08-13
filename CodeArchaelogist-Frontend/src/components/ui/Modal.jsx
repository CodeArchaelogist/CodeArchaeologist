import { AnimatePresence, motion } from "framer-motion";
import { TbX } from "react-icons/tb";

export default function Modal({ open, onClose, title, children }) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-void/70 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="w-full max-w-lg rounded-lg border border-border bg-surface-elevated shadow-panel"
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-border px-5 py-4">
                            <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
                            <button
                                onClick={onClose}
                                className="text-text-faint hover:text-text-primary focus-ring rounded"
                                aria-label="Close"
                            >
                                <TbX size={16} />
                            </button>
                        </div>
                        <div className="px-5 py-4">{children}</div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}