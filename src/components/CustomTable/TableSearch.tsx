import { useRef, useState, type ChangeEvent } from "react";
import { Search, X } from "lucide-react";

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

export interface TableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  label?: string;
  className?: string;
}

//-----------------------------------------------------------
// TABLE SEARCH
//-----------------------------------------------------------

export default function TableSearch({
  value,
  onChange,
  placeholder = "Search…",
  debounceMs = 250,
  label,
  className = "",
}: TableSearchProps) {
  const [draft, setDraft] = useState(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setDraft(value);
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setDraft(next);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (debounceMs === 0) {
      onChange(next);
      return;
    }
    timeoutRef.current = setTimeout(() => onChange(next), debounceMs);
  };

  const handleClear = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDraft("");
    onChange("");
  };

  return (
    <div className={className}>
      {label && (
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-text-secondary">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2 rounded-md border border-field-border bg-surface-light px-3.5 py-2.5 transition-colors duration-200 focus-within:border-border">
        <Search size={15} strokeWidth={2} className="shrink-0 text-text-muted" />
        <input
          type="text"
          value={draft}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full bg-transparent font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
        />
        {draft && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="shrink-0 text-text-muted transition-colors duration-200 hover:text-accent-2"
          >
            <X size={13} strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  );
}