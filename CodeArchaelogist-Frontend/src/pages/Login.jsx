import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { TbEye, TbEyeOff, TbArrowRight, TbMail, TbLock, TbAlertTriangle } from "react-icons/tb";
import Button from "../components/ui/Button.jsx";
import ThemeToggle from "../components/ui/ThemeToggle.jsx";
import { login } from "../services/api.js";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const redirectTo = "/profile";

    const handleChange = (e) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await login({ email, password });
            navigate("/dashboard/inv_8f3a2c");
        } catch (err) {
            setError(err.message || "Something went wrong.");
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-6">
            {/* Ambient backdrop */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
                <div className="absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full bg-evidence/5 blur-[100px]" />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "linear-gradient(#5B6474 1px, transparent 1px), linear-gradient(90deg, #5B6474 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />
            </div>

            <div className="absolute right-6 top-6">
                <ThemeToggle />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="relative w-full max-w-sm"
            >
                <div className="mb-8 flex flex-col items-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-accent/20 bg-accent/10 text-accent shadow-[0_0_24px_-4px] shadow-accent/30"
                    >
                        <span className="font-mono text-sm font-bold">CA</span>
                    </motion.div>
                    <p className="mt-3 text-[13px] font-semibold tracking-wide text-text-primary">
                        CODEARCHAEOLOGIST
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-text-faint">
                        Investigator access
                    </p>
                </div>
                <p className="text-center font-mono text-[11px] uppercase tracking-widest text-accent">
                    Welcome back
                </p>
                <h1 className="mt-3 text-center text-2xl font-semibold text-text-primary">
                    Login to your account
                </h1>

                <div className="rounded-xl border border-border bg-surface/90 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm">
                    <h1 className="text-lg font-semibold text-text-primary">Sign in</h1>
                    <p className="mt-1 text-xs text-text-muted">
                        Access your repository investigations.
                    </p>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="flex items-start gap-2 overflow-hidden rounded-md border border-danger/30 bg-danger/10 px-3 py-2.5 text-xs text-danger"
                            >
                                <TbAlertTriangle size={14} className="mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
                        <div>
                            <label htmlFor="email" className="mb-1.5 block text-[11px] uppercase tracking-wide text-text-faint">
                                Email
                            </label>
                            <div className="flex items-center gap-2.5 rounded-md border border-border bg-void px-3 py-2.5 transition-colors focus-within:border-accent/40">
                                <TbMail size={15} className="shrink-0 text-text-faint" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@company.com"
                                    className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-faint focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-1.5 block text-[11px] uppercase tracking-wide text-text-faint">
                                Password
                            </label>
                            <div className="flex items-center gap-2.5 rounded-md border border-border bg-void px-3 py-2.5 transition-colors focus-within:border-accent/40">
                                <TbLock size={15} className="shrink-0 text-text-faint" />
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-faint focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="focus-ring shrink-0 text-text-faint hover:text-text-primary"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <TbEyeOff size={16} /> : <TbEye size={16} />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="mt-1 w-full"
                            icon={TbArrowRight}
                            iconPosition="right"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>
                </div>

                <p className="mt-5 text-center text-xs text-text-muted">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-accent hover:underline">
                        Create one
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}