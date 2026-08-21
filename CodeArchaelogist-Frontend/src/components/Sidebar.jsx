import { NavLink, useParams } from "react-router-dom";
import {
    TbLayoutGrid,
    TbDna2,
    TbHistory,
    TbSearch,
    TbShieldExclamation,
    TbMessage2,
    TbSettings,
    TbUser,
    TbX,
} from "react-icons/tb";
import clsx from "clsx";
import { Link } from "react-router-dom";

const navItems = [
    { label: "Overview", icon: TbLayoutGrid, path: "dashboard" },
    { label: "Repository DNA", icon: TbDna2, path: "repository-dna" },
    { label: "Evolution", icon: TbHistory, path: "timeline" },
    { label: "Decision Forensics", icon: TbSearch, path: "decisions" },
    { label: "Risk & Impact", icon: TbShieldExclamation, path: "risks" },
    { label: "Ask Archaeologist", icon: TbMessage2, path: "ask" },
];

export default function Sidebar({ open, onClose }) {
    const { id } = useParams();

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-void/70 lg:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <aside
                className={clsx(
                    "fixed inset-y-0 left-0 z-50 flex h-screen w-60 shrink-0 flex-col border-r border-border bg-surface transition-transform duration-200 lg:static lg:translate-x-0",
                    open ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex items-center justify-between border-b border-border px-5 py-5">
                    <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-accent/10 text-accent">
                            <span className="font-mono text-xs font-bold">CA</span>
                        </div>
                        <span className="text-[13px] font-semibold tracking-wide text-text-primary">
                            <a href="/">CODEARCHAEOLOGIST</a>
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="focus-ring rounded text-text-faint hover:text-text-primary lg:hidden"
                        aria-label="Close menu"
                    >
                        <TbX size={18} />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-4">
                    <ul className="flex flex-col gap-0.5">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={`/${item.path}/${id}`}
                                    onClick={onClose}
                                    className={({ isActive }) =>
                                        clsx(
                                            "focus-ring flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors",
                                            isActive
                                                ? "bg-surface-elevated text-text-primary"
                                                : "text-text-muted hover:bg-surface-elevated/60 hover:text-text-primary"
                                        )
                                    }
                                >
                                    <item.icon size={15} strokeWidth={1.75} />
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="border-t border-border px-4 py-3">
                    <div className="flex items-center gap-2 text-[11px] text-text-muted">
                        <span className="h-1.5 w-1.5 rounded-full bg-success" />
                        Repository analyzed
                    </div>
                </div>

                <div className="flex flex-col gap-0.5 border-t border-border px-3 py-3">
                    <Link
                        to="/profile"
                        onClick={onClose}
                        className="focus-ring flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] text-text-muted hover:bg-surface-elevated/60 hover:text-text-primary"
                    >
                        <TbUser size={15} strokeWidth={1.75} />
                        Profile
                    </Link>
                </div>
            </aside>
        </>
    );
}