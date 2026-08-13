/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                void: "#05070B",
                surface: {
                    DEFAULT: "#0D111A",
                    elevated: "#141A24",
                    high: "#181F2B",
                },
                border: {
                    DEFAULT: "#1E2530",
                    subtle: "#171D27",
                },
                accent: {
                    DEFAULT: "#3FD0FF",
                    dim: "#1D8FB8",
                },
                evidence: {
                    DEFAULT: "#D9A441",
                    dim: "#9A752F",
                },
                danger: {
                    DEFAULT: "#F0554A",
                    dim: "#7A2E29",
                },
                success: {
                    DEFAULT: "#3FCB8A",
                    dim: "#255C42",
                },
                text: {
                    primary: "#EDF0F5",
                    muted: "#8A93A3",
                    faint: "#5B6474",
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
            },
            animation: {
                pulseDot: "pulseDot 1.8s ease-in-out infinite",
            },
        },
    },
    plugins: [],
};