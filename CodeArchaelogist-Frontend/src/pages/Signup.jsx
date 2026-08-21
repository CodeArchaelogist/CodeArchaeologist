import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbUser, TbMail, TbLock, TbArrowRight } from "react-icons/tb";
import BackButton from "../components/ui/BackButton.jsx";
import Button from "../components/ui/Button.jsx";
import ThemeToggle from "../components/ui/ThemeToggle.jsx";
import { signup } from "../services/api.js";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
        setError("");
        try {
            await signup({ name, email, password });
            navigate("/dashboard/inv_8f3a2c");
        } catch (err) {
            setError(err.message || "Something went wrong.");
        }
    };

    return (
        <div className="relative z-10 flex min-h-screen items-center justify-center overflow-hidden px-6">
            <div className="w-full max-w-md">
                <div className="mb-6 flex items-center justify-between">
                    <BackButton />
                    <ThemeToggle />
                </div>
                <p className="text-center font-mono text-[11px] uppercase tracking-widest text-accent">
                    Get started
                </p>
                <h1 className="mt-3 text-center text-2xl font-semibold text-text-primary">
                    Create an account
                </h1>

                <form onSubmit={handleSignup} className="mt-8 rounded-xl border border-border bg-surface p-5 flex flex-col gap-4">
                    {error && (
                        <div className="rounded-md border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-500">
                            {error}
                        </div>
                    )}
                    <div className="flex items-center gap-3 rounded-md border border-border bg-void px-3 py-3 focus-within:border-accent/40">
                        <TbUser size={16} className="text-text-faint" />
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full name"
                            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-faint focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-3 rounded-md border border-border bg-void px-3 py-3 focus-within:border-accent/40">
                        <TbMail size={16} className="text-text-faint" />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address"
                            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-faint focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-3 rounded-md border border-border bg-void px-3 py-3 focus-within:border-accent/40">
                        <TbLock size={16} className="text-text-faint" />
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-faint focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-3 rounded-md border border-border bg-void px-3 py-3 focus-within:border-accent/40">
                        <TbLock size={16} className="text-text-faint" />
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm password"
                            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-faint focus:outline-none"
                        />
                    </div>

                    <Button type="submit" className="mt-2 w-full" icon={TbArrowRight} iconPosition="right">
                        Sign Up
                    </Button>

                    <p className="mt-2 text-center text-xs text-text-muted">
                        Already have an account?{" "}
                        <button type="button" onClick={() => navigate("/login")} className="text-accent hover:underline focus:outline-none">
                            Log In
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}