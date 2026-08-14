import { AnimatePresence, motion } from "framer-motion";
import { TbSun, TbMoon } from "react-icons/tb";
import { useTheme } from "../../context/ThemeContext.jsx";
import clsx from "clsx";

export default function ThemeToggle({ className = "" }) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <button
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            aria-pressed={isDark}
            className={clsx(
                "focus-ring flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-surface text-text-muted transition-colors hover:border-accent/40 hover:text-accent",
                className
            )}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={isDark ? "moon" : "sun"}
                    initial={{ opacity: 0, rotate: -70, scale: 0.4 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 70, scale: 0.4 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="flex items-center justify-center"
                >
                    {isDark ? <TbMoon size={15} /> : <TbSun size={15} />}
                </motion.span>
            </AnimatePresence>
        </button>
    );
}