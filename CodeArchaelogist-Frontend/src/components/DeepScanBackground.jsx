import { useEffect, useRef } from "react";
import gsap from "gsap";
const BAR_COUNT = 24;

export default function DeepScanBackground() {
    const radarRef = useRef(null);
    const barsRef = useRef([]);
    const flashRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(radarRef.current, {
                rotate: 360,
                duration: 10,
                repeat: -1,
                ease: "none",
            });

            gsap.to(barsRef.current, {
                scaleY: () => gsap.utils.random(0.3, 1.6),
                duration: () => gsap.utils.random(1.2, 2.4),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: {
                    each: 0.08,
                    repeat: -1,
                },
            });

            gsap.fromTo(
                flashRef.current,
                { xPercent: -150, opacity: 0 },
                {
                    xPercent: 150,
                    opacity: 1,
                    duration: 2.2,
                    repeat: -1,
                    repeatDelay: 3.5,
                    ease: "power2.inOut",
                }
            );
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
            {/* Core sample bars */}
            <div className="absolute inset-0 flex items-end justify-between px-2 opacity-[0.14]">
                {Array.from({ length: BAR_COUNT }).map((_, i) => (
                    <div
                        key={i}
                        ref={(el) => (barsRef.current[i] = el)}
                        className="h-1/3 w-[2px] origin-bottom rounded-full bg-accent"
                        style={{ transform: "scaleY(0.5)" }}
                    />
                ))}
            </div>

            {/* Radar sweep */}
            <div
                ref={radarRef}
                className="absolute left-1/2 top-1/2 h-[140vmax] w-[140vmax] -translate-x-1/2 -translate-y-1/2 opacity-[0.16]"
                style={{
                    background:
                        "conic-gradient(from 0deg, rgb(var(--color-accent)) 0deg, transparent 40deg, transparent 360deg)",
                    maskImage: "radial-gradient(circle, black 0%, black 55%, transparent 75%)",
                    WebkitMaskImage: "radial-gradient(circle, black 0%, black 55%, transparent 75%)",
                }}
            />

            {/* Radar rings */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                {[240, 420, 620, 860].map((size) => (
                    <div
                        key={size}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent opacity-[0.08]"
                        style={{ width: size, height: size }}
                    />
                ))}
            </div>

            {/* Diagonal scan flash */}
            <div
                ref={flashRef}
                className="absolute -inset-y-1/2 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-accent/25 to-transparent"
            />

            {/* Base strata texture */}
            <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(180deg, rgb(var(--color-text-faint)) 0px, rgb(var(--color-text-faint)) 1px, transparent 1px, transparent 80px)",
                }}
            />
        </div>
    );
}