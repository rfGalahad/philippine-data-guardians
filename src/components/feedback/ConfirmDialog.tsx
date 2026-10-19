import { useEffect, useRef } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  loading?: boolean;
}

// ---------------------------------------------------------------------------
// CONFIRM DIALOG
// ---------------------------------------------------------------------------

export default function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  loading = false,
}: ConfirmDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement;
      panelRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    } else if (triggerRef.current instanceof HTMLElement) {
      triggerRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, loading, onOpenChange]);

  if (!open) return null;

  const isDanger = variant === "danger";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !loading && onOpenChange(false)}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="relative flex w-full max-w-sm flex-col overflow-hidden rounded-md border border-field-border bg-white shadow-xl"
      >
        {/* HEADER */}
        <div className="flex items-center gap-3 border-b border-field-border px-6 py-4">
          {isDanger && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="h-4.5 w-4.5 text-red-600" />
            </div>
          )}
          <h2
            id="confirm-dialog-title"
            className="flex-1 pt-1.5 font-heading text-lg font-semibold leading-snug text-text-primary"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={() => !loading && onOpenChange(false)}
            disabled={loading}
            aria-label="Close dialog"
            className="cursor-pointer rounded-md p-1 text-text-secondary transition hover:bg-black/5 disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        {description && (
          <div className="px-6 py-4">
            <p className="font-body text-sm leading-relaxed text-text-secondary">
              {description}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-field-border bg-black/2 px-6 py-3.5">
          <button
            type="button"
            data-autofocus
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="w-full cursor-pointer rounded-md px-3.5 py-2 font-body text-sm font-medium text-text-secondary transition hover:bg-black/5 disabled:opacity-40"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`w-full cursor-pointer inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 font-body text-sm font-medium text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isDanger ? "bg-red-600 hover:bg-red-700" : "bg-text-primary hover:bg-text-primary/80"
            }`}
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {loading ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}