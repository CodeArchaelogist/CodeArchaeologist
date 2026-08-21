import { useState } from "react";
import EvidenceCard from "./EvidenceCard.jsx";
import Modal from "./ui/Modal.jsx";

export default function EvidenceList({ evidence }) {
    const [selected, setSelected] = useState(null);

    return (
        <div className="flex flex-col gap-2">
            {(evidence || []).map((item) => (
                <EvidenceCard key={item?.ref} evidence={item} onClick={() => setSelected(item)} />
            ))}

            <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.label}>
                {selected && (
                    <div className="flex flex-col gap-3 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-text-faint">Reference</span>
                            <span className="font-mono text-xs text-accent">{selected?.ref}</span>
                        </div>
                        <p className="text-text-muted">
                            This {selected?.type === "commit" ? "commit" : selected?.type === "pr" ? "pull request" : "issue"}{" "}
                            is part of the evidence chain supporting the reconstructed historical intent above. Full diff
                            and discussion content will be available once the backend is connected.
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    );
}