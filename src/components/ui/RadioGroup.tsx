import { useId, type ChangeEvent } from "react";
import { useFieldContext } from "@/lib/form"; 

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

type RadioOption = {
  value: string;
  label: string;
  hint?: string;
  disabled?: boolean;
};

type RadioGroupProps = {
  legend: string;
  options: RadioOption[];
  hint?: string;
  aside?: React.ReactNode;
  layout?: "vertical" | "horizontal";
  className?: string;
};

//-----------------------------------------------------------
// HELPERS
//-----------------------------------------------------------

const getErrorMessage = (errors: unknown[]): string | undefined => {
  const first = errors[0];
  if (first == null) return undefined;
  if (typeof first === "string") return first;
  if (typeof first === "object" && "message" in first) {
    return (first as { message: string }).message;
  }
  return undefined;
};

//-----------------------------------------------------------
// SINGLE RADIO ITEM
//-----------------------------------------------------------

const radioOuterBase =
  "relative shrink-0 " +
  "w-[1.15rem] h-[1.15rem] rounded-full " +
  "border border-(--color-field-border) " +
  "bg-(--color-field-bg) " +
  "transition-[border-color,box-shadow,background-color] duration-(--transition) " +
  "peer-hover:not-peer-disabled:border-(--color-field-text)/40 " +
  "peer-focus-visible:border-accent " +
  "peer-focus-visible:shadow-[0_0_0_3px_var(--color-accent,#3a7bfd)]/20 " +
  "peer-checked:border-accent " +
  "peer-disabled:opacity-60 peer-disabled:cursor-not-allowed";

const radioDotBase =
  "absolute inset-0 m-auto w-[0.5rem] h-[0.5rem] rounded-full " +
  "bg-accent scale-0 transition-transform duration-(--transition) " +
  "peer-checked:scale-100";

const RadioItem = ({
  id,
  name,
  value,
  checked,
  onChange,
  label,
  hint,
  disabled,
  hasError,
}: {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  hint?: string;
  disabled?: boolean;
  hasError?: boolean;
}) => (
  <label
    htmlFor={id}
    className={
      "flex items-start gap-[0.65rem] " +
      (disabled ? "cursor-not-allowed" : "cursor-pointer group")
    }
  >
    <span className="relative flex items-center justify-center shrink-0 mt-[0.15rem]">
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="peer absolute inset-0 w-full h-full opacity-0 cursor-[inherit]"
      />
      <span
        className={
          radioOuterBase + (hasError ? " border-(--color-error,#e53e3e)" : "")
        }
      />
      <span className={radioDotBase} />
    </span>

    <span className="flex flex-col gap-[0.1rem] pt-[0.05rem]">
      <span
        className={
          "text-[0.9rem] font-(--font-body) leading-snug " +
          "text-field-text " +
          "transition-colors duration-(--transition) " +
          (disabled ? "opacity-60" : "group-hover:text-field-text")
        }
      >
        {label}
      </span>
      {hint && (
        <span className="text-[0.78rem] text-(--color-text-muted,#888) leading-snug">
          {hint}
        </span>
      )}
    </span>
  </label>
);

//-----------------------------------------------------------
// RADIO GROUP FIELD
//-----------------------------------------------------------

const RadioGroup = ({
  legend,
  options,
  hint,
  aside,
  layout = "vertical",
  className,
}: RadioGroupProps) => {
  const field = useFieldContext<string>();
  const groupId = useId();

  const errors = field.state.meta.isTouched ? field.state.meta.errors : [];
  const errorMessage = getErrorMessage(errors);
  const hasError = !!errorMessage;
  const feedbackId = errorMessage || hint ? `${groupId}-feedback` : undefined;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    field.handleChange(e.target.value);
    field.handleBlur();
  };

  return (
    <fieldset
      className={["flex flex-col gap-[0.6rem] border-none p-0 m-0", className ?? ""]
        .filter(Boolean)
        .join(" ")}
      aria-describedby={feedbackId}
      aria-invalid={hasError}
    >
      <div className="flex items-center justify-between">
        <legend className="text-[0.83rem] font-medium tracking-[0.02em] text-text-secondary p-0">
          {legend}
        </legend>
        {aside}
      </div>

      <div
        className={
          layout === "horizontal"
            ? "flex flex-wrap gap-x-6 gap-y-3"
            : "flex flex-col gap-3"
        }
      >
        {options.map((option) => {
          const id = `${groupId}-${option.value}`;
          return (
            <RadioItem
              key={option.value}
              id={id}
              name={field.name}
              value={option.value}
              checked={field.state.value === option.value}
              onChange={handleChange}
              label={option.label}
              hint={option.hint}
              disabled={option.disabled}
              hasError={hasError}
            />
          );
        })}
      </div>

      {(errorMessage || hint) && (
        <span
          id={feedbackId}
          className={
            errorMessage
              ? "block text-[0.78rem] text-(--color-error,#e53e3e)"
              : "block text-[0.78rem] text-(--color-text-muted,#888)"
          }
          role={errorMessage ? "alert" : undefined}
        >
          {errorMessage ?? hint}
        </span>
      )}
    </fieldset>
  );
};

export default RadioGroup;
export { RadioItem };