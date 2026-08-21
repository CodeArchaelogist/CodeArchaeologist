import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    TbBrandGithub,
    TbArrowRight,
    TbShieldCheck,
    TbClock,
    TbGitCommit,
    TbHelp,
    TbAlertTriangle,
    TbLoader2,
} from "react-icons/tb";
import BackButton from "../components/ui/BackButton.jsx";
import Button from "../components/ui/Button.jsx";
import { getRecentRepositories, createInvestigation } from "../services/api.js";
import ThemeToggle from "../components/ui/ThemeToggle.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const isDemoMode = () =>
    localStorage.getItem("DEMO_MODE") !== "false";

export default function RepositoryInput() {
    const [url, setUrl] = useState("");
    const [commitHash, setCommitHash] = useState("");
    const [question, setQuestion] = useState("");
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        getRecentRepositories().then(setRecent).catch(() => setRecent([]));
    }, []);

    const handleAnalyze = async () => {
        if (!url.trim()) {
            setError("Please enter a GitHub repository URL.");
            return;
        }

        setError(null);

        if (isDemoMode()) {
            navigate("/investigation/inv_8f3a2c");
            return;
        }

        if (!isAuthenticated) {
            navigate("/login", { state: { from: { pathname: "/analyze" } } });
            return;
        }

        setLoading(true);

        try {
            const data = await createInvestigation({
                repo_url: url.trim(),
                commit_hash: commitHash.trim() || "HEAD",
                question: question.trim() || "Why was this commit introduced, what evidence explains the change, and what could be affected if this change is removed?",
            });

            const investigationId = data?.investigation?.id || data?.investigation?._id || data?.id || data?._id;

            if (investigationId) {
                navigate(`/investigation/${investigationId}`);
            } else {
                throw new Error("Investigation created but no ID was returned.");
            }
        } catch (err) {
            setError(err.message || "Failed to create investigation. Please ensure the repository is public and accessible.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative z-10 flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
            <div className="w-full max-w-xl">
                <div className="mb-6 flex items-center justify-between">
                    <BackButton />
                    <ThemeToggle />
                </div>

                <p className="text-center font-mono text-[11px] uppercase tracking-widest text-accent">
                    New investigation
                </p>
                <h1 className="mt-3 text-center text-2xl font-semibold text-text-primary">
                    Paste a repository. <br /> We'll reconstruct its engineering history.
                </h1>

                {error && (
                    <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-danger/30 bg-danger/10 p-3.5 text-xs text-danger">
                        <TbAlertTriangle size={16} className="mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="mt-6 rounded-xl border border-border bg-surface p-5 shadow-xl shadow-black/20">
                    <label className="mb-1.5 block text-[11px] uppercase tracking-wide text-text-faint">
                        GitHub Repository URL
                    </label>
                    <div className="flex items-center gap-3 rounded-md border border-border bg-void px-3 py-3 transition-colors focus-within:border-accent/40">
                        <TbBrandGithub size={16} className="text-text-faint" />
                        <input
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                            placeholder="https://github.com/owner/repository"
                            disabled={loading}
                            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-faint focus:outline-none"
                        />
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="text-[11px] text-accent hover:underline"
                        >
                            {showAdvanced ? "− Hide commit & question options" : "+ Specify commit checkpoint or custom question"}
                        </button>
                    </div>

                    {showAdvanced && (
                        <div className="mt-4 flex flex-col gap-3 rounded-lg border border-border-subtle bg-surface-elevated/40 p-4">
                            <div>
                                <label className="mb-1 block text-[10px] uppercase tracking-wide text-text-faint">
                                    Target Commit Hash (Optional)
                                </label>
                                <div className="flex items-center gap-2 rounded-md border border-border bg-void px-3 py-2">
                                    <TbGitCommit size={14} className="text-text-faint" />
                                    <input
                                        value={commitHash}
                                        onChange={(e) => setCommitHash(e.target.value)}
                                        placeholder="HEAD (latest commit)"
                                        disabled={loading}
                                        className="w-full bg-transparent font-mono text-xs text-text-primary placeholder:text-text-faint focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-[10px] uppercase tracking-wide text-text-faint">
                                    Investigation Focus / Question (Optional)
                                </label>
                                <div className="flex items-center gap-2 rounded-md border border-border bg-void px-3 py-2">
                                    <TbHelp size={14} className="text-text-faint" />
                                    <input
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        placeholder="Why does this change exist and what is its historical intent?"
                                        disabled={loading}
                                        className="w-full bg-transparent text-xs text-text-primary placeholder:text-text-faint focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <Button
                        className="mt-5 w-full"
                        icon={loading ? TbLoader2 : TbArrowRight}
                        iconPosition="right"
                        onClick={handleAnalyze}
                        disabled={loading}
                    >
                        {loading ? "Analyzing Repository & Commit..." : "Analyze Repository"}
                    </Button>

                    <div className="mt-4 flex items-center gap-2 text-[11px] text-text-faint">
                        <TbShieldCheck size={12} className="text-success" />
                        <span>Read-only access. No source code or secrets are stored.</span>
                    </div>
                </div>

                {recent.length > 0 && (
                    <div className="mt-8">
                        <p className="mb-3 flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-text-faint">
                            <TbClock size={11} /> Recent repositories
                        </p>
                        <div className="flex flex-col gap-2">
                            {recent.map((repo, i) => (
                                <button
                                    key={repo.investigationId || repo.name || i}
                                    onClick={() => {
                                        if (repo.investigationId) {
                                            navigate(`/dashboard/${repo.investigationId}`);
                                        } else if (isDemoMode()) {
                                            navigate("/dashboard/inv_8f3a2c");
                                        } else if (repo.url) {
                                            setUrl(repo.url);
                                        }
                                    }}
                                    className="focus-ring flex items-center justify-between rounded-md border border-border bg-surface px-4 py-3 text-left transition-colors hover:border-accent/30"
                                >
                                    <div>
                                        <p className="text-sm text-text-primary">{repo.name}</p>
                                        <p className="font-mono text-[11px] text-text-faint">{repo.owner}</p>
                                    </div>
                                    <span className="text-[11px] text-text-faint">{repo.lastAnalyzed}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                    {["Commit history", "Issues & PRs", "Dependency graph"].map((item) => (
                        <div key={item} className="rounded-md border border-border-subtle bg-surface/50 py-3">
                            <p className="text-[11px] text-text-muted">{item}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}