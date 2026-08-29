import { useEffect, useRef, type ReactNode } from "react";

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface SlideOverPanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  loading?: boolean;
  loadingText?: string;
  error?: string | null;
  children?: ReactNode;
  widthClassName?: string;
}

//-----------------------------------------------------------
// SLIDE OVER PANEL
//-----------------------------------------------------------

export default function SlideOverPanel({
  open,
  onClose,
  title,
  loading = false,
  loadingText = "Loading…",
  error = null,
  children,
  widthClassName = "max-w-lg",
}: SlideOverPanelProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[2px] animate-[fadeIn_0.2s_ease-out]"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="slide-over-title"
        className={`flex h-full w-full ${widthClassName} translate-x-0 animate-[slideIn_0.25s_cubic-bezier(0.16,1,0.3,1)] flex-col bg-white shadow-2xl ring-1 ring-black/5`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/6 px-6 py-4">
          <h2
            id="slide-over-title"
            className="font-heading text-lg font-bold tracking-tight text-text-primary"
          >
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="group -mr-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-black/6 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform duration-150 group-hover:rotate-90"
            >
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto scrollbar-subtle px-6 py-5">
          {loading && (
            <div className="flex items-center gap-2.5 py-8 text-text-secondary">
              <svg
                className="h-4 w-4 animate-spin text-text-secondary"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-20"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  d="M22 12a10 10 0 0 0-10-10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <p className="font-body text-sm">{loadingText}</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
                viewBox="0 0 16 16"
                fill="none"
              >
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
                <path
                  d="M8 5v3.5M8 11h.01"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
              <p className="font-body text-sm text-red-700">{error}</p>
            </div>
          )}

          {!loading && !error && children}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[fadeIn_0\\.2s_ease-out\\],
          .animate-\\[slideIn_0\\.25s_cubic-bezier\\(0\\.16\\,1\\,0\\.3\\,1\\)\\] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}