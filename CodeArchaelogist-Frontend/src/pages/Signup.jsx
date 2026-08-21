import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TbEye, TbEyeOff, TbArrowRight } from "react-icons/tb";
import Button from "../components/ui/Button.jsx";
import ThemeToggle from "../components/ui/ThemeToggle.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Signup() {
    const { signup } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

        setError(null);
        setLoading(true);
        try {
            await signup({ name: form.name, email: form.email, password: form.password });
            navigate("/dashboard/inv_8f3a2c", { replace: true });
        } catch (err) {
            setError(err.message || "Signup failed. Please try again.");
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
                    <h1 className="text-lg font-semibold text-text-primary">Create an account</h1>
                    <p className="mt-1 text-xs text-text-muted">
                        Start investigating your repositories.
                    </p>

                    {error && (
                        <div className="mt-4 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
                        <div>
                            <label htmlFor="name" className="mb-1.5 block text-[11px] uppercase tracking-wide text-text-faint">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Ada Lovelace"
                                className="focus-ring w-full rounded-md border border-border bg-void px-3 py-2.5 text-sm text-text-primary placeholder:text-text-faint"
                            />
                        </div>

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
                                    autoComplete="new-password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="At least 8 characters"
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

                        <div>
                            <label htmlFor="confirmPassword" className="mb-1.5 block text-[11px] uppercase tracking-wide text-text-faint">
                                Confirm password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-enter your password"
                                className="focus-ring w-full rounded-md border border-border bg-void px-3 py-2.5 text-sm text-text-primary placeholder:text-text-faint"
                            />
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
            </div>
        </div>
    );
}