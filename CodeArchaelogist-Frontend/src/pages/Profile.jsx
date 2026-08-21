import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    TbUser,
    TbMail,
    TbShieldCheck,
    TbLogout,
    TbClock,
    TbGitBranch,
    TbSearch,
    TbActivity,
    TbChevronRight,
} from "react-icons/tb";

import PageHeader from "../components/PageHeader.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getInvestigations } from "../services/api.js";

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [investigations, setInvestigations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadInvestigations() {
            try {
                const data = await getInvestigations();

                setInvestigations(
                    data?.investigations ||
                    data ||
                    []
                );
            } catch (err) {
                console.error("Failed to load investigations:", err);
            } finally {
                setLoading(false);
            }
        }

        loadInvestigations();
    }, []);

    const completedCount = investigations.filter(
        (item) => item.status === "complete"
    ).length;

    const repositoryCount = new Set(
        investigations
            .map((item) => item.repositoryId?._id || item.repositoryId)
            .filter(Boolean)
    ).size;

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login", { replace: true });
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    if (loading) {
        return <LoadingState />;
    }

    return (
        <div className="relative z-10 min-h-screen overflow-hidden text-text-primary">
            {toast.visible && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed right-6 top-6 z-50 flex items-center gap-3 rounded-lg border border-border bg-surface-elevated px-4 py-3 shadow-lg shadow-black/50"
                >
                    <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                    <span className="font-mono text-xs text-text-primary">{toast.message}</span>
                </motion.div>
            )}
            <div className="relative">
                <PageHeader
                    eyebrow="Profile"
                    title="Investigator identity"
                />
            </div>
            {/* Identity */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                <div className="rounded-lg border border-border bg-surface p-6 lg:col-span-2">

                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/10">
                            <span className="font-mono text-2xl font-semibold text-accent">
                                {getInitials(user?.name)}
                            </span>
                        </div>

                        <div>
                            <p className="text-xl font-semibold text-text-primary">
                                {user?.name || "Unknown Investigator"}
                            </p>

                            <p className="mt-1 font-mono text-xs text-text-muted">
                                {user?.email || "No email available"}
                            </p>

                            <div className="mt-3 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-success" />

                                <span className="text-xs text-text-muted">
                                    Account active
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">

                        <ProfileField
                            icon={TbUser}
                            label="Name"
                            value={user?.name || "—"}
                        />

                        <ProfileField
                            icon={TbMail}
                            label="Email"
                            value={user?.email || "—"}
                        />

                    </div>
                </div>

                {/* Account status */}
                <div className="rounded-lg border border-border bg-surface p-6">

                    <div className="flex items-center gap-2">
                        <TbShieldCheck
                            size={17}
                            className="text-success"
                        />

                        <p className="text-sm font-semibold text-text-primary">
                            Account security
                        </p>
                    </div>

                    <div className="mt-5 flex flex-col divide-y divide-border-subtle">

                        <SecurityRow
                            label="Authentication"
                            value="JWT session"
                        />

                        <SecurityRow
                            label="Password"
                            value="Encrypted"
                        />

                        <SecurityRow
                            label="Session"
                            value="Active"
                        />

                    </div>

                    <div className="mt-5 rounded-md border border-success/20 bg-success/5 px-3 py-2.5">
                        <p className="text-[11px] leading-relaxed text-text-muted">
                            Your authentication credentials are handled by the
                            backend. Repository source code and GitHub tokens
                            are not stored in your profile.
                        </p>
                    </div>
                </div>
            </section>

            {/* Statistics */}
            <section>

                <p className="mb-3 text-sm font-semibold text-text-primary">
                    Investigation record
                </p>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                    <StatCard
                        icon={TbSearch}
                        label="Investigations"
                        value={investigations.length}
                    />

                    <StatCard
                        icon={TbGitBranch}
                        label="Repositories"
                        value={repositoryCount}
                    />

                    <StatCard
                        icon={TbActivity}
                        label="Completed"
                        value={completedCount}
                    />

                    <StatCard
                        icon={TbShieldCheck}
                        label="Success rate"
                        value={
                            investigations.length
                                ? `${Math.round(
                                    (completedCount /
                                        investigations.length) *
                                    100
                                )}%`
                                : "—"
                        }
                    />

                </div>
            </section>

            {/* Recent investigations */}
            <section>

                <div className="mb-3 flex items-center justify-between">

                    <p className="text-sm font-semibold text-text-primary">
                        Recent investigations
                    </p>

                    <span className="font-mono text-[10px] uppercase tracking-wide text-text-faint">
                        {investigations.length} records
                    </span>

                </div>

                <div className="overflow-hidden rounded-lg border border-border">

                    {investigations.length === 0 ? (
                        <EmptyInvestigations />
                    ) : (
                        <div className="divide-y divide-border-subtle">

                            {investigations.slice(0, 8).map((investigation) => (
                                <InvestigationRow
                                    key={investigation._id}
                                    investigation={investigation}
                                    onClick={() =>
                                        navigate(
                                            `/dashboard/${investigation._id}`
                                        )
                                    }
                                />
                            ))}

                        </div>
                    )}

                </div>
            </section>

            {/* Security / logout */}
            <section>

                <p className="mb-3 text-sm font-semibold text-text-primary">
                    Session
                </p>

                <div className="rounded-lg border border-border bg-surface p-5">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <p className="text-sm font-medium text-text-primary">
                                Sign out of CodeArchaeologist
                            </p>

                            <p className="mt-1 text-xs text-text-muted">
                                End your current authenticated session on this device.
                            </p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-danger/30 bg-danger/5 px-4 py-2 text-xs font-medium text-danger transition-colors hover:bg-danger/10"
                        >
                            <TbLogout size={15} />
                            Sign out
                        </button>

                    </div>

                </div>

            </section>
        </div>
    );
}


/* ---------------- Components ---------------- */

function ProfileField({ icon: Icon, label, value }) {
    return (
        <div className="rounded-md border border-border-subtle bg-surface-elevated/40 p-3">

            <div className="flex items-center gap-2">

                <Icon
                    size={14}
                    className="text-text-faint"
                />

                <span className="text-[10px] uppercase tracking-wide text-text-faint">
                    {label}
                </span>

            </div>

            <p className="mt-2 truncate text-sm text-text-primary">
                {value}
            </p>

        </div>
    );
}


function SecurityRow({ label, value }) {
    return (
        <div className="flex items-center justify-between py-3">

            <span className="text-xs text-text-muted">
                {label}
            </span>

            <span className="font-mono text-[11px] text-text-primary">
                {value}
            </span>

        </div>
    );
}


function StatCard({ icon: Icon, label, value }) {
    return (
        <div className="rounded-lg border border-border bg-surface p-4">

            <div className="flex items-center justify-between">

                <span className="text-[11px] uppercase tracking-wide text-text-faint">
                    {label}
                </span>

                <Icon
                    size={16}
                    className="text-accent"
                />

            </div>

            <p className="mt-3 font-mono text-2xl font-semibold text-text-primary">
                {value}
            </p>

        </div>
    );
}


function InvestigationRow({ investigation, onClick }) {
    const repository = investigation.repositoryId;

    return (
        <button
            onClick={onClick}
            className="group flex w-full items-center justify-between bg-surface px-5 py-4 text-left transition-colors hover:bg-surface-elevated/60"
        >

            <div className="min-w-0">

                <div className="flex items-center gap-3">

                    <TbSearch
                        size={15}
                        className="shrink-0 text-accent"
                    />

                    <p className="truncate text-sm font-medium text-text-primary">
                        {repository?.repoName || "Repository investigation"}
                    </p>

                    <StatusBadge
                        label={investigation.status || "unknown"}
                        tone={investigation.status || "unknown"}
                    />

                </div>

                <div className="mt-2 flex items-center gap-3 pl-6">

                    <span className="font-mono text-[10px] text-text-faint">
                        {shortHash(investigation.commitHash)}
                    </span>

                    <span className="text-text-faint">
                        ·
                    </span>

                    <span className="truncate text-[11px] text-text-muted">
                        {investigation.question}
                    </span>

                </div>

            </div>

            <TbChevronRight
                size={16}
                className="ml-4 shrink-0 text-text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-text-primary"
            />

        </button>
    );
}


function EmptyInvestigations() {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">

            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface-elevated">
                <TbSearch
                    size={18}
                    className="text-text-faint"
                />
            </div>

            <p className="mt-3 text-sm font-medium text-text-primary">
                No investigations yet
            </p>

            <p className="mt-1 max-w-sm text-xs text-text-muted">
                Investigate a repository commit to start building your
                archaeological record.
            </p>

        </div>
    );
}


/* ---------------- Helpers ---------------- */

function getInitials(name = "") {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (!parts.length) return "CA";

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}


function shortHash(hash = "") {
    if (!hash) return "—";
    return hash.slice(0, 7);
}