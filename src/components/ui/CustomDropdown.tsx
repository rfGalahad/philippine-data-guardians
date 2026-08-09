import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";

//-----------------------------------------------------------
// ICONS (inline, matching FormField's icon convention)
//-----------------------------------------------------------

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

export type DropdownOption = string | { label: string; value: string };

type SharedFieldProps = {
  id: string;
  label: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  aside?: ReactNode;
  className?: string;
};

// Matches the shape useForm's handleChange/handleBlur expect:
// (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
type NativeStyleHandler = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => void;

export type CustomDropdownProps = SharedFieldProps & {
  options: DropdownOption[];
  value?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;

  // Preferred: drop-in compatible with useForm's handleChange/handleBlur.
  onChange?: NativeStyleHandler;
  onBlur?: NativeStyleHandler;

  // Legacy/manual signature, still supported for callers who want the
  // raw SyntheticEvent + value instead of a synthesized native event.
  // If both onChange and onChangeRaw are provided, onChange wins.
  onChangeRaw?: (e: React.SyntheticEvent, newValue: string) => void;
};

const getLabel = (option: DropdownOption): string =>
  typeof option === "string" ? option : option.label;

const getValue = (option: DropdownOption): string =>
  typeof option === "string" ? option : option.value;

// Builds a fake ChangeEvent whose `target` looks enough like a real
// input/select for `{ name, value, type } = e.target` destructuring
// (as used in useForm) to work correctly.
const synthesizeChangeEvent = (
  sourceEvent: React.SyntheticEvent,
  name: string,
  value: string
): React.ChangeEvent<HTMLInputElement> => {
  const fakeTarget = {
    name,
    value,
    type: "select-one",
  } as unknown as HTMLInputElement;

  return {
    ...sourceEvent,
    target: fakeTarget,
    currentTarget: fakeTarget,
  } as unknown as React.ChangeEvent<HTMLInputElement>;
};

//-----------------------------------------------------------
// SHARED STYLES (mirrors FormField's inputBase)
//-----------------------------------------------------------

const triggerBase =
  "w-full px-4 py-3 flex items-center justify-between gap-2 " +
  "bg-(--color-field-bg) " +
  "border border-(--color-field-border) rounded-[var(--radius-sm)] " +
  "text-[0.95rem] font-[var(--font-body)] " +
  "outline-none text-left cursor-pointer " +
  "transition-[border-color,box-shadow,background-color] duration-[var(--transition)] " +
  "hover:not-focus:border-(--color-field-text)/30 " +
  "focus:border-(--color-field-text) " +
  "focus:shadow-[0_0_0_3px_var(--color-field-text)]/15 " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const inputErrorClasses = "border-[var(--color-error,#e53e3e)] outline-[var(--color-error,#e53e3e)]";

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export const CustomDropdown = ({
  id,
  label,
  placeholder = "Select an option",
  error,
  hint,
  aside,
  className,
  options,
  value,
  onChange,
  onBlur,
  onChangeRaw,
  disabled,
  required,
  name,
}: CustomDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const fieldName = name ?? id;

  const hasError = !!error;
  const feedbackId = error || hint ? `${id}-feedback` : undefined;
  const listboxId = `${id}-listbox`;

  const selectedOption = options.find((option) => getValue(option) === value);
  const selectedLabel = selectedOption ? getLabel(selectedOption) : "";

  // Keep the highlighted option scrolled into view
  useEffect(() => {
    if (!open || highlightedIndex < 0) return;
    const node = listRef.current?.children[highlightedIndex] as HTMLElement | undefined;
    node?.scrollIntoView({ block: "nearest" });
  }, [open, highlightedIndex]);

  const openList = () => {
    if (disabled) return;
    const currentIndex = options.findIndex((option) => getValue(option) === value);
    setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
    setOpen(true);
  };

  const fireBlur = (sourceEvent: React.SyntheticEvent) => {
    if (onBlur) {
      onBlur(synthesizeChangeEvent(sourceEvent, fieldName, value ?? ""));
    }
  };

  const selectOption = (e: React.SyntheticEvent, option: DropdownOption) => {
    const newValue = getValue(option);

    if (onChange) {
      onChange(synthesizeChangeEvent(e, fieldName, newValue));
    } else if (onChangeRaw) {
      onChangeRaw(e, newValue);
    }

    setOpen(false);
    // Selecting an option also counts as leaving the field, so fire
    // blur-driven validation immediately (no separate blur event
    // will follow a closed custom listbox).
    fireBlur(e);
  };

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      openList();
      return;
    }

    if (!open) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => Math.min(prev + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (highlightedIndex >= 0) selectOption(e, options[highlightedIndex]);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        fireBlur(e);
        break;
    }
  };

  return (
    <div className="flex flex-col gap-[0.45rem]" ref={rootRef}>
      <div className="flex items-center justify-between">
        <label className="text-[0.83rem] font-medium tracking-[0.02em] text-text-secondary" htmlFor={id}>
          {label}
        </label>
        {aside}
      </div>

      <div className="relative">
        <button
          id={id}
          type="button"
          name={fieldName}
          disabled={disabled}
          className={[triggerBase, hasError ? inputErrorClasses : "", className ?? ""]
            .filter(Boolean)
            .join(" ")}
          onClick={() => (open ? setOpen(false) : openList())}
          onKeyDown={handleTriggerKeyDown}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-invalid={hasError}
          aria-describedby={feedbackId}
          aria-required={required}
        >
          <span
            className={
              selectedLabel
                ? "truncate text-field-text"
                : "truncate text-field-placeholder"
            }
          >
            {selectedLabel || placeholder}
          </span>
          <span
            className={
              "text-text-muted shrink-0 transition-transform duration-(--transition) [&>svg]:w-4 [&>svg]:h-4 " +
              (open ? "rotate-180" : "")
            }
          >
            <ChevronDownIcon />
          </span>
        </button>

        {open && (
          <ul
            id={listboxId}
            ref={listRef}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={id}
            className={
              "absolute z-20 mt-1.5 max-h-60 w-full overflow-y-auto " +
              "bg-field-bg border border-field-border rounded-sm " +
              "shadow-lg py-1"
            }
          >
            {options.length === 0 && (
              <li className="px-4 py-2.5 text-[0.9rem] text-text-muted">No options</li>
            )}

            {options.map((option, index) => {
              const optionValue = getValue(option);
              const optionLabel = getLabel(option);
              const isSelected = optionValue === value;
              const isHighlighted = index === highlightedIndex;

              return (
                <li
                  key={optionValue}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={(e) => selectOption(e, option)}
                  className={[
                    "flex items-center justify-between gap-2 px-4 py-2.5 text-[0.9rem] cursor-pointer",
                    isHighlighted ? "bg-field-text/10" : "",
                    isSelected ? "text-field-text font-medium" : "text-text-secondary",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span className="truncate">{optionLabel}</span>
                  {isSelected && (
                    <span className="shrink-0 [&>svg]:w-4 [&>svg]:h-4">
                      <CheckIcon />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {(error || hint) && (
        <span
          id={feedbackId}
          className={
            error
              ? "block mt-1 text-[0.78rem] text-(--color-error,#e53e3e)"
              : "block mt-1 text-[0.78rem] text-(--color-text-muted,#888)"
          }
          role={error ? "alert" : undefined}
        >
          {error ?? hint}
        </span>
      )}
    </div>
  );
};

export default CustomDropdown;