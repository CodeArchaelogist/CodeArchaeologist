import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import StatusBadge from "./ui/StatusBadge.jsx";

const riskColor = { HIGH: "#F0554A", MEDIUM: "#D9A441", LOW: "#3FCB8A" };

// Deterministic circular layout keeps the graph stable and click-friendly
// without pulling in a physics engine.
function layoutNodes(nodes, width, height) {
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(width, height) / 2 - 60;
    return (nodes || []).map((node, i) => {
        const angle = (i / (nodes || []).length) * Math.PI * 2 - Math.PI / 2;
        return { ...node, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    });
}

export default function DependencyGraph({ graph, nodeDetails, onSelectNode }) {
    const width = 640;
    const height = 420;
    const positioned = useMemo(() => layoutNodes(graph?.nodes, width, height), [graph?.nodes]);
    const [hovered, setHovered] = useState(null);

    const findNode = (id) => (positioned || []).find((n) => n?.id === id);

    return (
        <div className="rounded-lg border border-border bg-surface p-4">
            <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
                {(graph?.edges || []).map((edge, i) => {
                    const s = findNode(edge?.source);
                    const t = findNode(edge?.target);
                    if (!s || !t) return null;
                    const isActive = hovered === edge?.source || hovered === edge?.target;
                    return (
                        <line
                            key={i}
                            x1={s.x}
                            y1={s.y}
                            x2={t.x}
                            y2={t.y}
                            stroke={isActive ? "#3FD0FF" : "#1E2530"}
                            strokeWidth={isActive ? 1.5 : 1}
                        />
                    );
                })}

                {(positioned || []).map((node) => (
                    <g
                        key={node.id}
                        transform={`translate(${node.x}, ${node.y})`}
                        className="cursor-pointer"
                        onMouseEnter={() => setHovered(node.id)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => onSelectNode(node.id)}
                    >
                        <motion.circle
                            r={node.type === "package" ? 5 : 8}
                            fill="#0D111A"
                            stroke={riskColor[node.risk] || "#5B6474"}
                            strokeWidth={hovered === node.id ? 2.5 : 1.5}
                            whileHover={{ scale: 1.15 }}
                        />
                        <text
                            x={0}
                            y={node.type === "package" ? 16 : 20}
                            textAnchor="middle"
                            className="font-mono"
                            fontSize={9}
                            fill={hovered === node.id ? "#EDF0F5" : "#8A93A3"}
                        >
                            {node.id}
                        </text>
                    </g>
                ))}
            </svg>

            <div className="mt-4 flex items-center gap-4 border-t border-border-subtle pt-3 text-[11px] text-text-faint">
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full border border-danger" /> High risk
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full border border-evidence" /> Medium risk
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full border border-success" /> Low risk
                </span>
                <span className="ml-auto">Click a node to inspect it</span>
            </div>
        </div>
    );
}