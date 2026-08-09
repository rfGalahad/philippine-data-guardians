import type { ComponentType, SVGProps } from "react";
import { Loader2 } from "lucide-react";

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

export type ButtonVariant = "filled" | "outlined" | "text";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonColor = "black" | "white" | "accent" | "neutral";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export interface ButtonProps {
  label: string;
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  type?: "button" | "submit" | "reset";
  prefixIcon?: IconComponent;
  suffixIcon?: IconComponent;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
}

//-----------------------------------------------------------
// STYLES
//-----------------------------------------------------------

const sizeStyles: Record<ButtonSize, string> = {
  sm: "text-sm px-3 py-1.5 gap-1.5 rounded-(--radius-sm)",
  md: "text-sm px-4 py-2.5 gap-2 rounded-(--radius-sm)",
  lg: "text-base px-5 py-3 gap-2.5 rounded-(--radius-sm)",
};

// Text variant has no border/background, so it doesn't need matching horizontal
// padding to align visually with filled/outlined buttons — keep it tighter.
const textSizeStyles: Record<ButtonSize, string> = {
  sm: "text-sm px-1 py-1 gap-1.5",
  md: "text-sm px-1 py-1.5 gap-2",
  lg: "text-base px-1 py-2 gap-2.5",
};

const iconSizeStyles: Record<ButtonSize, string> = {
  sm: "w-4 h-4",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

const colorStyles: Record<ButtonVariant, Record<ButtonColor, string>> = {
  filled: {
    black:
      "bg-(--color-text-primary) text-(--color-bg) border border-(--color-text-primary) hover:opacity-90 active:opacity-80 disabled:opacity-40",
    white:
      "bg-(--color-bg) text-(--color-text-primary) border border-(--color-border) hover:bg-(--color-surface) active:bg-(--color-surface-2) disabled:opacity-40",
    accent:
      "bg-(--color-accent) text-[#020d1c] border border-(--color-accent) hover:bg-(--color-accent-hover) hover:border-(--color-accent-hover) active:opacity-90 disabled:opacity-40",
    neutral:
      "bg-(--color-surface-2) text-white border border-(--color-border) hover:bg-(--color-surface) active:opacity-80 disabled:opacity-40",
  },
  outlined: {
    black:
      "bg-transparent text-(--color-text-primary) border border-(--color-text-primary)/40 hover:bg-(--color-text-primary)/10 hover:border-(--color-text-primary)/70 active:bg-(--color-text-primary)/20 disabled:opacity-40",
    white:
      "bg-transparent text-(--color-bg) border border-(--color-border) hover:bg-(--color-bg)/10 active:bg-(--color-bg)/25 disabled:opacity-40",
    accent:
      "bg-transparent text-(--color-accent) border border-(--color-accent)/60 hover:bg-(--color-accent-dim) hover:border-(--color-accent) active:bg-(--color-accent-dim) disabled:opacity-40",
    neutral:
      "bg-transparent text-(--color-text-secondary) border border-(--color-border) hover:bg-(--color-text-primary)/5 hover:border-(--color-text-primary)/30 hover:text-(--color-text-primary) active:bg-(--color-text-primary)/10 disabled:opacity-40",
  },
  text: {
    black:
      "bg-transparent border border-transparent text-(--color-text-primary) hover:opacity-70 active:opacity-60 disabled:opacity-40",
    white:
      "bg-transparent border border-transparent text-(--color-bg) hover:opacity-70 active:opacity-60 disabled:opacity-40",
    accent:
      "bg-transparent border border-transparent text-(--color-accent) hover:opacity-70 active:opacity-60 disabled:opacity-40",
    neutral:
      "bg-transparent border border-transparent text-(--color-text-secondary) hover:text-(--color-text-primary) active:opacity-60 disabled:opacity-40",
  },
};

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export const Button = ({
  label,
  variant = "filled",
  color = "black",
  size = "md",
  type = "button",
  prefixIcon: PrefixIcon,
  suffixIcon: SuffixIcon,
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className = "",
}: ButtonProps) => {
  const isDisabled = disabled || loading;
  const iconSize = iconSizeStyles[size];

  const focusRing =
    color === "accent"
      ? "focus-visible:ring-(--color-accent)"
      : color === "white"
      ? "focus-visible:ring-(--color-bg)"
      : "focus-visible:ring-(--color-text-primary)";

  return (
     <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading}
      className={[
        fullWidth ? "flex w-full" : "inline-flex",
        "items-center justify-center font-medium",
        "font-(--font-body)",
        "transition-colors duration-(--transition)",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        focusRing,
        "cursor-pointer disabled:cursor-not-allowed",
        variant === "text" ? textSizeStyles[size] : sizeStyles[size],
        colorStyles[variant][color],
        className,
      ].join(" ")}
    >
      {loading ? (
        <Loader2 className={`${iconSize} animate-spin`} aria-hidden="true" />
      ) : (
        PrefixIcon && <PrefixIcon className={iconSize} aria-hidden="true" />
      )}

      <span className="font-bold">{loading ? "Loading…" : label}</span>

      {!loading && SuffixIcon && (
        <SuffixIcon className={iconSize} aria-hidden="true" />
      )}
    </button>
  );
};

export default Button;