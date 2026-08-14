import { TbBrandGithub, TbExternalLink, TbMenu2 } from "react-icons/tb";
import { useParams } from "react-router-dom";
import SearchBar from "./SearchBar.jsx";
import StatusBadge from "./ui/StatusBadge.jsx";
import ThemeToggle from "./ui/ThemeToggle.jsx";
import { repository } from "../data/mockData.js";

export default function Navbar({ onMenuClick }) {
    const { id } = useParams();

    return (
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-void px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="focus-ring shrink-0 rounded text-text-muted hover:text-text-primary lg:hidden"
                    aria-label="Open menu"
                >
                    <TbMenu2 size={20} />
                </button>
                <div className="hidden items-center gap-2 truncate font-mono text-xs text-text-muted sm:flex">
                    <span className="text-text-faint">investigation</span>
                    <span className="text-text-faint">/</span>
                    <span className="text-text-primary">{repository.name}</span>
                    <span className="text-text-faint">/</span>
                    <span className="text-text-faint">{id}</span>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                <SearchBar className="hidden sm:flex" />
                <StatusBadge label="Analyzed" tone="complete" className="hidden sm:inline-flex" />
                <a
                    href={repository.url}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-text-muted hover:text-text-primary hover:border-accent/40 sm:px-3"
                >
                    <TbBrandGithub size={14} />
                    <span className="hidden sm:inline">Repository</span>
                    <TbExternalLink size={11} className="hidden sm:inline" />
                </a>
                <ThemeToggle />
                <div className="h-7 w-7 shrink-0 rounded-full border border-border bg-surface-elevated" />
            </div>
        </header>
    );
}