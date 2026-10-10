import type { ComponentType, SVGProps } from "react";

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

export type IconButtonSize = "sm" | "md";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export interface IconButtonProps {
  icon: IconComponent;
  label: string; 
  size?: IconButtonSize;
  badge?: number;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

//-----------------------------------------------------------
// STYLES
//-----------------------------------------------------------

const sizeStyles: Record<IconButtonSize, string> = {
  sm: "w-8 h-8 rounded-(--radius-sm)",
  md: "w-9 h-9 rounded-(--radius-sm)",
};

const iconSizeStyles: Record<IconButtonSize, string> = {
  sm: "w-4 h-4",
  md: "w-[18px] h-[18px]",
};

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export const IconButton = ({
  icon: Icon,
  label,
  size = "md",
  badge,
  active = false,
  disabled = false,
  onClick,
  className = "",
}: IconButtonProps) => {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={[
        "relative inline-flex items-center justify-center",
        "border border-border-light",
        "bg-transparent text-text-primary",
        "cursor-pointer transition-colors duration-(--transition)",
        "hover:text-text-primary hover:border-border",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-text-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        active
          ? "bg-surface-2 text-text-primary border-border"
          : "",
        sizeStyles[size],
        className,
      ].join(" ")}
    >
      <Icon className={iconSizeStyles[size]} aria-hidden="true" />

      {typeof badge === "number" && badge > 0 && (
        <span
          className="
            absolute -top-1 -right-1
            min-w-3.75 h-3.75 px-0.75
            rounded-full bg-red-500 ring-2 ring-surface-light-2
            text-white text-[9px] font-semibold leading-none
            flex items-center justify-center
            pointer-events-none
          "
        >
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </button>
  );
};

export default IconButton;