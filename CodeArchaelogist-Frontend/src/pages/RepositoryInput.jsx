import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TbBrandGithub, TbArrowRight, TbShieldCheck, TbClock } from "react-icons/tb";
import BackButton from "../components/ui/BackButton.jsx";
import Button from "../components/ui/Button.jsx";
import { getRecentRepositories } from "../services/api.js";

export default function RepositoryInput() {
    const [url, setUrl] = useState("");
    const [recent, setRecent] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getRecentRepositories().then(setRecent);
    }, []);

    const handleAnalyze = () => {
        if (!url.trim()) return;
        navigate("/investigation/inv_8f3a2c");
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-void px-6">
            <div className="w-full max-w-xl">
                <BackButton className="mb-6" />
                <p className="text-center font-mono text-[11px] uppercase tracking-widest text-accent">
                    New investigation
                </p>
                <h1 className="mt-3 text-center text-2xl font-semibold text-text-primary">
                    Paste a repository. <br /> We'll reconstruct its engineering history.
                </h1>

                <div className="mt-8 rounded-xl border border-border bg-surface p-5">
                    <div className="flex items-center gap-3 rounded-md border border-border bg-void px-3 py-3 focus-within:border-accent/40">
                        <TbBrandGithub size={16} className="text-text-faint" />
                        <input
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://github.com/example/project"
                            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-faint focus:outline-none"
                        />
                    </div>
                    <Button className="mt-4 w-full" icon={TbArrowRight} iconPosition="right" onClick={handleAnalyze}>
                        Analyze Repository
                    </Button>

                    <div className="mt-4 flex items-center gap-2 text-[11px] text-text-faint">
                        <TbShieldCheck size={12} />
                        <span>Read-only access. No code is stored beyond the active investigation.</span>
                    </div>
                </div>

                <div className="mt-8">
                    <p className="mb-3 flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-text-faint">
                        <TbClock size={11} /> Recent repositories
                    </p>
                    <div className="flex flex-col gap-2">
                        {recent.map((repo) => (
                            <button
                                key={repo.name}
                                onClick={() => navigate("/investigation/inv_8f3a2c")}
                                className="focus-ring flex items-center justify-between rounded-md border border-border bg-surface px-4 py-3 text-left hover:border-accent/30"
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