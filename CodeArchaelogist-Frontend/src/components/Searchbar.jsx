import { TbSearch } from "react-icons/tb";

export default function SearchBar({ placeholder = "Search files, commits, decisions...", className = "" }) {
  return (
    <div
      className={`flex h-9 w-72 items-center gap-2 rounded-md border border-border bg-surface px-3 text-text-faint focus-within:border-accent/40 ${className}`}
    >
      <TbSearch size={14} />
      <input
        type="text"
        placeholder={placeholder}
        className="h-full w-full bg-transparent text-xs text-text-primary placeholder:text-text-faint focus:outline-none"
      />
      <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-text-faint">
        ⌘K
      </kbd>
    </div>
  );
}