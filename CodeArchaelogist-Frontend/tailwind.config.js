/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                void: "rgb(var(--color-void) / <alpha-value>)",
                surface: {
                    DEFAULT: "rgb(var(--color-surface) / <alpha-value>)",
                    elevated: "rgb(var(--color-surface-elevated) / <alpha-value>)",
                    high: "rgb(var(--color-surface-high) / <alpha-value>)",
                },
                border: {
                    DEFAULT: "rgb(var(--color-border) / <alpha-value>)",
                    subtle: "rgb(var(--color-border-subtle) / <alpha-value>)",
                },
                accent: {
                    DEFAULT: "rgb(var(--color-accent) / <alpha-value>)",
                    dim: "rgb(var(--color-accent-dim) / <alpha-value>)",
                },
                evidence: {
                    DEFAULT: "rgb(var(--color-evidence) / <alpha-value>)",
                    dim: "rgb(var(--color-evidence-dim) / <alpha-value>)",
                },
                danger: {
                    DEFAULT: "rgb(var(--color-danger) / <alpha-value>)",
                    dim: "rgb(var(--color-danger-dim) / <alpha-value>)",
                },
                success: {
                    DEFAULT: "rgb(var(--color-success) / <alpha-value>)",
                    dim: "rgb(var(--color-success-dim) / <alpha-value>)",
                },
                text: {
                    primary: "rgb(var(--color-text-primary) / <alpha-value>)",
                    muted: "rgb(var(--color-text-muted) / <alpha-value>)",
                    faint: "rgb(var(--color-text-faint) / <alpha-value>)",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
            },
            boxShadow: {
                panel: "0 1px 0 0 rgba(255,255,255,0.02) inset, 0 8px 24px -12px rgba(0,0,0,0.6)",
            },
            keyframes: {
                pulseDot: {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.35 },
                },
                ambientPulse: {
                    "0%, 100%": { opacity: 0.5 },
                    "50%": { opacity: 1 },
                },
                ambientDrift: {
                    "0%": { backgroundPosition: "0px 0px" },
                    "100%": { backgroundPosition: "48px 48px" },
                },
            },
            animation: {
                pulseDot: "pulseDot 1.8s ease-in-out infinite",
                ambientPulse: "ambientPulse 6s ease-in-out infinite",
                ambientDrift: "ambientDrift 40s linear infinite",
            },
        },
    },
    plugins: [],
};