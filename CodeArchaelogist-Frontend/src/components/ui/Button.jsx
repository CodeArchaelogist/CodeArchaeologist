import clsx from "clsx";

const variants = {
    primary: "bg-accent text-void hover:bg-accent/90",
    secondary: "bg-surface-elevated text-text-primary border border-border hover:border-accent/40",
    ghost: "text-text-muted hover:text-text-primary hover:bg-surface-elevated",
    danger: "bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20",
};

const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-sm",
};

export default function Button({
    children,
    variant = "primary",
    size = "md",
    icon: Icon,
    iconPosition = "left",
    className,
    ...props
}) {
    return (
        <button
            className={clsx(
                "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-150",
                "focus-ring disabled:opacity-40 disabled:pointer-events-none",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {Icon && iconPosition === "left" && <Icon size={16} strokeWidth={2} />}
            {children}
            {Icon && iconPosition === "right" && <Icon size={16} strokeWidth={2} />}
        </button>
    );
}