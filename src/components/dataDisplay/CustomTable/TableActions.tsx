import type { ReactNode } from "react";

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

export type ActionVariant = "primary" | "secondary" | "danger";

export interface TableAction {
  key: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: ActionVariant;
  disabled?: boolean;
}

export interface TableActionsProps {
  selectedCount?: number;
  bulkActions?: TableAction[];
  primaryActions?: TableAction[];
  onClearSelection?: () => void;
  className?: string;
}

//-----------------------------------------------------------
// HELPERS
//-----------------------------------------------------------

const variantClass: Record<ActionVariant, string> = {
  primary: "bg-accent text-bg hover:bg-accent-2",
  secondary: "border border-field-border bg-surface-light text-text-primary hover:border-accent",
  danger: "border border-transparent bg-transparent text-red-500 hover:bg-red-500/10",
};

function ActionButton({ action }: { action: TableAction }) {
  return (
    <button
      type="button"
      onClick={action.onClick}
      disabled={action.disabled}
      className={[
        "flex items-center gap-1.5 rounded-md px-3.5 py-2 text-xs font-bold uppercase tracking-widest transition-colors duration-200",
        variantClass[action.variant ?? "secondary"],
        "disabled:cursor-not-allowed disabled:opacity-40",
        "cursor-pointer"
      ].join(" ")}
    >
      {action.icon}
      {action.label}
    </button>
  );
}

//-----------------------------------------------------------
// TABLE ACTIONS
//-----------------------------------------------------------

export default function TableActions({
  selectedCount = 0,
  bulkActions = [],
  primaryActions = [],
  onClearSelection,
  className = "",
}: TableActionsProps) {
  const hasSelection = selectedCount > 0;

  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-3">
        {hasSelection && (
          <>
            {onClearSelection && (
              <button
                type="button"
                onClick={onClearSelection}
                className="cursor-pointer text-xs font-bold uppercase tracking-widest text-text-muted transition-colors duration-200 hover:text-accent-2"
              >
                Clear
              </button>
            )}
            {bulkActions.length > 0 && (
              <div className="flex items-center gap-2">
                {bulkActions.map((action) => (
                  <ActionButton key={action.key} action={action} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {primaryActions.length > 0 && (
        <div className="flex items-center gap-2">
          {primaryActions.map((action) => (
            <ActionButton key={action.key} action={action} />
          ))}
        </div>
      )}
    </div>
  );
}