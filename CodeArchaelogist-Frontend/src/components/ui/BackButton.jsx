import { useNavigate } from "react-router-dom";
import { TbArrowLeft } from "react-icons/tb";

export default function BackButton({ className = "" }) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className={`focus-ring flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-text-muted transition-colors hover:border-accent/40 hover:text-text-primary ${className}`}
            aria-label="Go back"
        >
            <TbArrowLeft size={14} />
            Back
        </button>
    );
}