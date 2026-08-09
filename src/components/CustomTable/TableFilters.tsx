import { useEffect, useRef, useState } from "react";

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  /** Unique id for the filter; matches the key used in `values`. */
  key: string;
  /** Label shown on the filter's trigger button. */
  label: string;
  options: FilterOption[];
}

export interface TableFiltersProps {
  filters: FilterConfig[];
  /** Selected option values, keyed by filter key. */
  values: Record<string, string[]>;
  onChange: (key: string, values: string[]) => void;
  onClearAll?: () => void;
  className?: string;
}

//-----------------------------------------------------------
// ICON
//-----------------------------------------------------------

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="9"
      height="6"
      viewBox="0 0 9 6"
      className={`ml-1.5 shrink-0 fill-current transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path d="M4.5 6L0 0H9L4.5 6Z" />
    </svg>
  );
}

//-----------------------------------------------------------
// SINGLE FILTER DROPDOWN
//-----------------------------------------------------------

function FilterDropdown({
  config,
  selected,
  onChange,
}: {
  config: FilterConfig;
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const active = selected.length > 0;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={[
          "cursor-pointer",
          "flex items-center rounded-md border px-3.5 py-2 text-xs font-bold uppercase tracking-widest transition-colors duration-200",
          "hover:border-border hover:text-text-primary",
          active
            ? "border-accent bg-accent-dim text-accent-2"
            : "border-field-border bg-surface-light text-text-secondary hover:text-primary",
        ].join(" ")}
      >
        {config.label}
        {active && (
          <span className="ml-1.5 rounded-full bg-accent px-1.5 py-0.5 text-[10px] text-bg">
            {selected.length}
          </span>
        )}
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className="absolute left-0 z-10 mt-1.5 w-56 rounded-md border border-field-border bg-surface-light py-1.5 shadow-lg">
          {config.options.length === 0 ? (
            <p className="px-3.5 py-2 text-sm text-text-muted">No options</p>
          ) : (
            config.options.map((opt) => {
              const checked = selected.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className="flex cursor-pointer items-center gap-2.5 px-3.5 py-2 text-sm text-text-primary transition-colors bg-surface-light duration-200 hover:bg-surface-light-2"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleOption(opt.value)}
                    className="h-3.5 w-3.5 accent-accent"
                  />
                  {opt.label}
                </label>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

//-----------------------------------------------------------
// TABLE FILTERS
//-----------------------------------------------------------

export default function TableFilters({
  filters,
  values,
  onChange,
  onClearAll,
  className = "",
}: TableFiltersProps) {
  const hasActive = Object.values(values).some((v) => v.length > 0);

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {filters.map((config) => (
        <FilterDropdown
          key={config.key}
          config={config}
          selected={values[config.key] ?? []}
          onChange={(next) => onChange(config.key, next)}
        />
      ))}
      {hasActive && onClearAll && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-bold uppercase tracking-widest text-text-muted transition-colors duration-200 hover:text-accent-2"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}