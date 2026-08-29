import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';

import { useFieldContext } from '@/lib/form';

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

export type DropdownOption = string | { label: string; value: string };

type ComboBoxProps = {
  label: string;
  placeholder?: string;
  hint?: string;
  aside?: ReactNode;
  className?: string;
  options: DropdownOption[];
  disabled?: boolean;
  required?: boolean;
  clearable?: boolean; // NEW
};

const getLabel = (option: DropdownOption): string =>
  typeof option === 'string' ? option : option.label;

const getValue = (option: DropdownOption): string =>
  typeof option === 'string' ? option : option.value;

const getErrorMessage = (errors: unknown[]): string | undefined => {
  const first = errors[0];
  if (first == null) return undefined;
  if (typeof first === 'string') return first;
  if (typeof first === 'object' && 'message' in first) {
    return (first as { message: string }).message;
  }
  return undefined;
};

//-----------------------------------------------------------
// SHARED STYLES
//-----------------------------------------------------------

const triggerBase =
  'w-full px-4 py-3 flex items-center justify-between gap-2 ' +
  'bg-(--color-field-bg) ' +
  'border border-(--color-field-border) rounded-[var(--radius-sm)] ' +
  'text-[0.95rem] font-[var(--font-body)] ' +
  'outline-none text-left ' +
  'transition-[border-color,box-shadow,background-color] duration-[var(--transition)] ' +
  'hover:not-focus-within:border-(--color-field-text)/30 ' +
  'focus-within:border-(--color-field-text) ' +
  'focus-within:shadow-[0_0_0_3px_var(--color-field-text)]/15 ' +
  'has-disabled:cursor-not-allowed has-disabled:opacity-60';

const inputErrorClasses = 'border-[var(--color-error,#e53e3e)] outline-[var(--color-error,#e53e3e)]';

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

const ComboBox = ({
  label,
  placeholder = 'Select an option',
  hint,
  aside,
  className,
  options,
  disabled,
  required,
  clearable = true,
}: ComboBoxProps) => {
  const field = useFieldContext<string>();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(''); // NEW: what the user has typed
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const id = field.name;
  const value = field.state.value;

  const errors = field.state.meta.isTouched ? field.state.meta.errors : [];
  const errorMessage = getErrorMessage(errors);
  const hasError = !!errorMessage;
  const feedbackId = errorMessage || hint ? `${id}-feedback` : undefined;
  const listboxId = `${id}-listbox`;

  const selectedOption = options.find((option) => getValue(option) === value);
  const selectedLabel = selectedOption ? getLabel(selectedOption) : '';

  // Filter options by whatever's currently typed
  const filteredOptions = query.trim()
    ? options.filter((option) =>
        getLabel(option).toLowerCase().includes(query.trim().toLowerCase())
      )
    : options;

  // What shows in the input: the live query while typing, otherwise the
  // selected label, otherwise nothing.
  const displayValue = open ? query : selectedLabel;

  useEffect(() => {
    if (!open || highlightedIndex < 0) return;
    const node = listRef.current?.children[highlightedIndex] as HTMLElement | undefined;
    node?.scrollIntoView({ block: 'nearest' });
  }, [open, highlightedIndex]);

  // Click-outside closes the list without clearing the field
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
        field.handleBlur();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const openList = () => {
    if (disabled) return;
    const currentIndex = options.findIndex((option) => getValue(option) === value);
    setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
    setQuery(''); // start typing fresh; selected value stays in field state
    setOpen(true);
  };

  const selectOption = (option: DropdownOption) => {
    field.handleChange(getValue(option));
    setQuery('');
    setOpen(false);
    field.handleBlur();
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    field.handleChange('');
    setQuery('');
    setOpen(false);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setHighlightedIndex(0);
    if (!open) setOpen(true);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      openList();
      return;
    }

    if (!open) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          selectOption(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setQuery('');
        setOpen(false);
        break;
      case 'Backspace':
        // Typing backspace on an empty query with a selected value clears it
        if (query === '' && value) {
          field.handleChange('');
        }
        break;
      case 'Tab':
        setOpen(false);
        setQuery('');
        field.handleBlur();
        break;
    }
  };

  return (
    <div className="flex flex-col gap-[0.45rem]" ref={rootRef}>
      <div className="flex items-center justify-between">
        <label className="text-[0.83rem] font-medium tracking-[0.02em] text-text-secondary" htmlFor={id}>
          {label}
          {required && <span className="text-(--color-error,#e53e3e)"> *</span>}
        </label>
        {aside}
      </div>

      <div className="relative">
        <div
          className={[triggerBase, hasError ? inputErrorClasses : '', className ?? '']
            .filter(Boolean)
            .join(' ')}
        >
          <input
            id={id}
            ref={inputRef}
            type="text"
            name={field.name}
            disabled={disabled}
            value={displayValue}
            onChange={handleInputChange}
            onFocus={openList}
            onKeyDown={handleInputKeyDown}
            placeholder={placeholder}
            autoComplete="off"
            className="w-full bg-transparent outline-none truncate text-field-text placeholder:text-field-placeholder disabled:cursor-not-allowed"
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-invalid={hasError}
            aria-describedby={feedbackId}
            aria-required={required}
            aria-autocomplete="list"
          />

          <span className="flex items-center gap-1 shrink-0">
            {clearable && value && !disabled && (
              <button
                type="button"
                onClick={clearSelection}
                tabIndex={-1}
                aria-label="Clear selection"
                className="text-text-muted hover:text-field-text [&>svg]:w-3.5 [&>svg]:h-3.5"
              >
                <X />
              </button>
            )}
            <span
              className={
                'text-text-muted transition-transform duration-(--transition) [&>svg]:w-4 [&>svg]:h-4 ' +
                (open ? 'rotate-180' : '')
              }
            >
              <ChevronDown />
            </span>
          </span>
        </div>

        {open && (
          <ul
            id={listboxId}
            ref={listRef}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={id}
            className={
              'absolute z-20 mt-1.5 max-h-60 w-full overflow-y-auto ' +
              'bg-field-bg border border-field-border rounded-sm ' +
              'shadow-lg py-1'
            }
          >
            {filteredOptions.length === 0 && (
              <li className="px-4 py-2.5 text-[0.9rem] text-text-muted">No options</li>
            )}

            {filteredOptions.map((option, index) => {
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
                  onMouseDown={(e) => e.preventDefault()} // keep focus on input
                  onClick={() => selectOption(option)}
                  className={[
                    'flex items-center justify-between gap-2 px-4 py-2.5 text-[0.9rem] cursor-pointer',
                    isHighlighted ? 'bg-field-text/10' : '',
                    isSelected ? 'text-field-text font-medium' : 'text-text-secondary',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span className="truncate">{optionLabel}</span>
                  {isSelected && (
                    <span className="shrink-0 [&>svg]:w-4 [&>svg]:h-4">
                      <Check />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {(errorMessage || hint) && (
        <span
          id={feedbackId}
          className={
            errorMessage
              ? 'block mt-1 text-[0.78rem] text-(--color-error,#e53e3e)'
              : 'block mt-1 text-[0.78rem] text-(--color-text-muted,#888)'
          }
          role={errorMessage ? 'alert' : undefined}
        >
          {errorMessage ?? hint}
        </span>
      )}
    </div>
  );
};

export default ComboBox;