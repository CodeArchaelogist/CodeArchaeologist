import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { TbEye, TbEyeOff, TbArrowRight } from "react-icons/tb";
import Button from "../components/ui/Button.jsx";
import ThemeToggle from "../components/ui/ThemeToggle.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const redirectTo = location.state?.from?.pathname || "/dashboard/inv_8f3a2c";

    const handleChange = (e) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!form.email.trim() || !form.password) {
            setError("Please enter both email and password.");
            return;
        }

        setLoading(true);
        try {
            await login(form);
            navigate(redirectTo, { replace: true });
        } catch (err) {
            setError(err.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-void px-6">
            <div className="absolute right-6 top-6">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-sm">
                <div className="mb-8 flex flex-col items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/10 text-accent">
                        <span className="font-mono text-sm font-bold">CA</span>
                    </div>
                    <p className="mt-3 text-[13px] font-semibold tracking-wide text-text-primary">
                        CODEARCHAEOLOGIST
                    </p>
                </div>

                <div className="rounded-lg border border-border bg-surface p-6">
                    <h1 className="text-lg font-semibold text-text-primary">Sign in</h1>
                    <p className="mt-1 text-xs text-text-muted">
                        Access your repository investigations.
                    </p>

                    {error && (
                        <div className="mt-4 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
                        <div>
                            <label htmlFor="email" className="mb-1.5 block text-[11px] uppercase tracking-wide text-text-faint">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@company.com"
                                className="focus-ring w-full rounded-md border border-border bg-void px-3 py-2.5 text-sm text-text-primary placeholder:text-text-faint"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-1.5 block text-[11px] uppercase tracking-wide text-text-faint">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="focus-ring w-full rounded-md border border-border bg-void px-3 py-2.5 pr-10 text-sm text-text-primary placeholder:text-text-faint"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="focus-ring absolute right-2.5 top-1/2 -translate-y-1/2 text-text-faint hover:text-text-primary"
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
            </div>
        </div>
    );
}