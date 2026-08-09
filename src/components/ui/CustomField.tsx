import { useState } from "react";

//-----------------------------------------------------------
// ICONS
//-----------------------------------------------------------

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

//-----------------------------------------------------------
// INTERFACE / TYPES
//-----------------------------------------------------------

type SharedFieldProps = {
  id: string;
  label: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  aside?: React.ReactNode;
  className?: string;
};

type SingleLineProps = SharedFieldProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> & {
    multiline?: false;
    inputRef?: React.RefObject<HTMLInputElement | null>;
    rows?: never;
  };

type MultilineProps = SharedFieldProps &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> & {
    multiline: true;
    inputRef?: React.RefObject<HTMLTextAreaElement | null>;
    rows?: number;
    type?: never;
  };

type CustomFieldProps = SingleLineProps | MultilineProps;

//-----------------------------------------------------------
// STYLES
//-----------------------------------------------------------

const inputBase =
  "w-full px-4 py-3 " +
  "bg-(--color-field-bg) " +
  "border border-(--color-field-border) rounded-[var(--radius-sm)] " +
  "text-(--color-field-text) font-[var(--font-body)] text-[0.95rem] " +
  "outline-none " +
  "transition-[border-color,box-shadow,background-color] duration-[var(--transition)] " +
  "placeholder:text-(--color-field-placeholder) " +
  "hover:not-focus:border-(--color-field-text)/30 " +
  "focus:border-(--color-field-text) " +
  "focus:shadow-[0_0_0_3px_var(--color-field-text)]/15" + 
  "disabled:cursor-not-allowed disabled:opacity-60";

const textareaBase = inputBase + " resize-y min-h-[6rem] leading-relaxed";

const inputErrorClasses = "border-[var(--color-error,#e53e3e)] outline-[var(--color-error,#e53e3e)]";

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

const CustomField = (props: CustomFieldProps) => {
  const {
    id,
    label,
    placeholder,
    error,
    hint,
    aside,
    className,
    multiline,
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  const hasError = !!error;
  const feedbackId = error || hint ? `${id}-feedback` : undefined;

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
          </label>
          {aside}
        </div>

        <textarea
          ref={inputRef}
          rows={rows}
          className={[
            textareaBase,
            hasError ? inputErrorClasses : "",
            className ?? "",
          ]
            .filter(Boolean)
            .join(" ")}
          placeholder={placeholder}
          aria-invalid={hasError}
          aria-describedby={feedbackId}
          {...textareaProps}
        />

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
  }

  const { type, inputRef, ...inputProps } = props as SingleLineProps;
  const isPassword = type === "password";
  const resolvedType = isPassword && showPassword ? "text" : type;

  return (
    <div className="flex flex-col gap-[0.45rem]">
      <div className="flex items-center justify-between">
        <label
          className="text-[0.83rem] font-medium tracking-[0.02em] text-text-secondary"
          htmlFor={id}
        >
          {label}
        </label>
        {aside}
      </div>

      <div className={isPassword ? "relative" : undefined}>
        <input
          ref={inputRef}
          className={[
            inputBase,
            isPassword ? "pr-[2.8rem]" : "",
            hasError ? inputErrorClasses : "",
            className ?? "",
          ]
            .filter(Boolean)
            .join(" ")}
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
              "absolute right-3 top-1/2 -translate-y-1/2 " +
              "bg-transparent border-none cursor-pointer " +
              "text-text-muted " +
              "flex items-center p-1 " +
              "transition-colors duration-(--transition) " +
              "hover:text-text-secondary " +
              "[&>svg]:w-4.5 [&>svg]:h-4.5"
            }
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>

      {(error || hint) && (
        <span
          id={feedbackId}
          className={
            (error
              ? "block mt-1 text-[0.78rem] text-(--color-error,#e53e3e)"
              : "block mt-1 text-[0.78rem] text-(--color-text-muted,#888)") +
            " text-left"
          }
          role={error ? "alert" : undefined}
        >
          {error ?? hint}
        </span>
      )}
    </div>
  );
};

export default CustomField;

/**
 * Standalone "forgot password" style link, matching the original
 * `.forgot-link` CSS class. Use as the `aside` prop, e.g.:
 *
 *   <CustomField id="password" label="Password" type="password"
 *     aside={<ForgotLink href="/forgot-password" />} />
 */
export const ForgotLink = ({
  href,
  children = "Forgot password?",
}: {
  href: string;
  children?: React.ReactNode;
}) => (
  <a
    href={href}
    className={
      "text-[0.78rem] text-accent no-underline " +
      "transition-colors duration-(--transition) " +
      "hover:text-accent-hover hover:underline"
    }
  >
    {children}
  </a>
);