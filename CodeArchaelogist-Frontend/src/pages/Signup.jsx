import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { TbEye, TbEyeOff, TbArrowRight, TbUser, TbMail, TbLock, TbAlertTriangle, TbCheck } from "react-icons/tb";
import Button from "../components/ui/Button.jsx";
import ThemeToggle from "../components/ui/ThemeToggle.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function getPasswordStrength(password) {
    if (!password) return { score: 0, label: "" };

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
        { label: "Too short", color: "bg-danger" },
        { label: "Weak", color: "bg-danger" },
        { label: "Fair", color: "bg-[#D9A441]" },
        { label: "Good", color: "bg-[#D9A441]" },
        { label: "Strong", color: "bg-success" },
        { label: "Excellent", color: "bg-success" },
    ];

    return { score, ...levels[Math.min(score, levels.length - 1)] };
}

export default function Signup() {
    const { signup } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    // Consolidated State
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const strength = useMemo(() => getPasswordStrength(form.password), [form.password]);
    const passwordsMatch = form.confirmPassword.length > 0 && form.password === form.confirmPassword;

    const handleChange = (e) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    };

    const validate = () => {
        if (!form.name.trim()) return "Please enter your name.";
        if (!form.email.trim()) return "Please enter your email.";
        if (form.password.length < 8) return "Password must be at least 8 characters.";
        if (form.password !== form.confirmPassword) return "Passwords do not match.";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");
        setLoading(true);
        
        try {
            await signup({ name: form.name, email: form.email, password: form.password });
            navigate("/analyze", { replace: true }); 
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-6 py-12">
            {/* Ambient backdrop */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
                <div className="absolute bottom-0 left-0 h-[320px] w-[320px] rounded-full bg-evidence/5 blur-[100px]" />
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
                        New investigator
                    </p>
                </div>
                <p className="text-center font-mono text-[11px] uppercase tracking-widest text-accent">
                    Get started
                </p>
                <h1 className="mt-3 text-center text-2xl font-semibold text-text-primary">
                    Create an account
                </h1>

                <div className="rounded-xl border border-border bg-surface/90 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm">
                    <h1 className="text-lg font-semibold text-text-primary">Create an account</h1>
                    <p className="mt-1 text-xs text-text-muted">
                        Start investigating your repositories.
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
                            <label htmlFor="name" className="mb-1.5 block text-[11px] uppercase tracking-wide text-text-faint">
                                Name
                            </label>
                            <div className="flex items-center gap-2.5 rounded-md border border-border bg-void px-3 py-2.5 transition-colors focus-within:border-accent/40">
                                <TbUser size={15} className="shrink-0 text-text-faint" />
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Ada Lovelace"
                                    className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-faint focus:outline-none"
                                />
                            </div>
                        </div>

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
                                    autoComplete="new-password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="At least 8 characters"
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

                            <AnimatePresence>
                                {form.password && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-2 overflow-hidden"
                                    >
                                        <div className="flex gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1 flex-1 rounded-full transition-colors ${
                                                        i < strength.score ? strength.color : "bg-surface-elevated"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="mt-1.5 text-[11px] text-text-faint">{strength.label}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="mb-1.5 block text-[11px] uppercase tracking-wide text-text-faint">
                                Confirm password
                            </label>
                            <div
                                className={`flex items-center gap-2.5 rounded-md border bg-void px-3 py-2.5 transition-colors focus-within:border-accent/40 ${
                                    form.confirmPassword && !passwordsMatch ? "border-danger/40" : "border-border"
                                }`}
                            >
                                <TbLock size={15} className="shrink-0 text-text-faint" />
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Re-enter your password"
                                    className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-faint focus:outline-none"
                                />
                                {passwordsMatch && <TbCheck size={16} className="shrink-0 text-success" />}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="mt-1 w-full"
                            icon={TbArrowRight}
                            iconPosition="right"
                            disabled={loading}
                        >
                            {loading ? "Creating account..." : "Create account"}
                        </Button>
                    </form>
                </div>

                <p className="mt-5 text-center text-xs text-text-muted">
                    Already have an account?{" "}
                    <Link to="/login" className="text-accent hover:underline">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}