import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { useFieldContext } from '@/lib/form'; // adjust path to your form.ts

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

type SharedFieldProps = {
  label: string;
  placeholder?: string;
  hint?: string;
  aside?: React.ReactNode;
  className?: string;
  required?: boolean;
};

type SingleLineProps = SharedFieldProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id' | 'value' | 'onChange' | 'onBlur' | 'name'> & {
    multiline?: false;
    inputRef?: React.RefObject<HTMLInputElement | null>;
    rows?: never;
  };

type MultilineProps = SharedFieldProps &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'value' | 'onChange' | 'onBlur' | 'name'> & {
    multiline: true;
    inputRef?: React.RefObject<HTMLTextAreaElement | null>;
    rows?: number;
    type?: never;
  };

type TextFieldProps = SingleLineProps | MultilineProps;

//-----------------------------------------------------------
// STYLES
//-----------------------------------------------------------

const inputBase =
  'w-full px-4 py-3 ' +
  'bg-(--color-field-bg) ' +
  'border border-(--color-field-border) rounded-[var(--radius-sm)] ' +
  'text-(--color-field-text) font-[var(--font-body)] text-[0.95rem] ' +
  'outline-none ' +
  'transition-[border-color,box-shadow,background-color] duration-[var(--transition)] ' +
  'placeholder:text-(--color-field-placeholder) ' +
  'hover:not-focus:border-(--color-field-text)/30 ' +
  'focus:border-(--color-field-text) ' +
  'focus:shadow-[0_0_0_3px_var(--color-field-text)]/15' +
  'disabled:cursor-not-allowed disabled:opacity-60';

const textareaBase = inputBase + ' resize-y min-h-[6rem] leading-relaxed';

const inputErrorClasses = 'border-[var(--color-error,#e53e3e)] outline-[var(--color-error,#e53e3e)]';

//-----------------------------------------------------------
// HELPERS
//-----------------------------------------------------------

// TanStack Form's field.state.meta.errors can hold plain strings
// (from manual validator functions) or Standard Schema issues
// (from Zod validators, shaped like { message, path, code, ... }).
// Normalize both into display strings here.
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
// MAIN COMPONENT
//-----------------------------------------------------------

const TextField = (props: TextFieldProps) => {
  const field = useFieldContext<string>();
  const [showPassword, setShowPassword] = useState(false);

  const { label, placeholder, hint, aside, className, multiline, required } = props;

  // Only surface errors after the field has been touched/blurred,
  // so the user doesn't see "required" the instant the page loads.
  const errors = field.state.meta.isTouched ? field.state.meta.errors : [];
  const errorMessage = getErrorMessage(errors);
  const hasError = !!errorMessage;

  const id = field.name;
  const feedbackId = errorMessage || hint ? `${id}-feedback` : undefined;

  if (multiline) {
    const { type: inputRef, rows = 4, ...textareaProps } =
      props as MultilineProps & { type?: never };

    return (
      <div className="flex flex-col gap-[0.45rem]">
        <div className="flex items-center justify-between">
          <label
            className="text-[0.83rem] font-medium tracking-[0.02em] text-text-secondary"
            htmlFor={id}
          >
            {label}
            {required && <span className="text-(--color-error,#e53e3e)"> *</span>}
          </label>
          {aside}
        </div>

        <textarea
          ref={inputRef}
          id={id}
          name={field.name}
          rows={rows}
          value={field.state.value ?? ''}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          className={[
            textareaBase,
            hasError ? inputErrorClasses : '',
            className ?? '',
          ]
            .filter(Boolean)
            .join(' ')}
          placeholder={placeholder}
          aria-invalid={hasError}
          aria-describedby={feedbackId}
          {...textareaProps}
        />

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
  }

  const { type, inputRef, ...inputProps } = props as SingleLineProps;
  const isPassword = type === 'password';
  const resolvedType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="flex flex-col gap-[0.45rem]">
      <div className="flex items-center justify-between">
        <label
          className="text-[0.83rem] font-medium tracking-[0.02em] text-text-secondary"
          htmlFor={id}
        >
          {label}
          {required && <span className="text-(--color-error,#e53e3e)"> *</span>}
        </label>
        {aside}
      </div>

      <div className={isPassword ? 'relative' : undefined}>
        <input
          ref={inputRef}
          id={id}
          name={field.name}
          value={field.state.value ?? ''}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          className={[
            inputBase,
            isPassword ? 'pr-[2.8rem]' : '',
            hasError ? inputErrorClasses : '',
            className ?? '',
          ]
            .filter(Boolean)
            .join(' ')}
          type={resolvedType}
          placeholder={placeholder}
          aria-invalid={hasError}
          aria-describedby={feedbackId}
          {...inputProps}
        />

        {isPassword && (
          <button
            type="button"
            className={
              'absolute right-3 top-1/2 -translate-y-1/2 ' +
              'bg-transparent border-none cursor-pointer ' +
              'text-text-muted ' +
              'flex items-center p-1 ' +
              'transition-colors duration-(--transition) ' +
              'hover:text-text-secondary ' +
              '[&>svg]:w-4.5 [&>svg]:h-4.5'
            }
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
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

export default TextField;