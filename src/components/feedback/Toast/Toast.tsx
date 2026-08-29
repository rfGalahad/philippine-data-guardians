import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import type { ToastItem } from './toast.types';

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface ToastProps {
  toast: ToastItem;
  onClose: () => void;
}

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const ICONS: Record<string, React.ReactNode> = {
  success: <CheckCircle2 size={18} strokeWidth={2.5} />,
  error: <XCircle size={18} strokeWidth={2.5} />,
  warning: <AlertTriangle size={18} strokeWidth={2.5} />,
  info: <Info size={18} strokeWidth={2.5} />,
};

const TYPE_STYLES: Record<string, string> = {
  success: 'bg-green-700',
  error: 'bg-red-700',
  warning: 'bg-amber-700',
  info: 'bg-blue-700',
};

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export default function Toast({ toast, onClose }: ToastProps) {

  const { 
    type, 
    message, 
    title, 
    duration = 5, 
    closable = true, 
    action 
  } = toast;

  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingMsRef = useRef(duration * 1000);
  const startedAtRef = useRef(0);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 200);
  };

  const startTimer = () => {
    if (duration <= 0) return; // 0 = persistent, no auto-dismiss
    startedAtRef.current = Date.now();
    timerRef.current = setTimeout(handleClose, remainingMsRef.current);
  };

  const pauseTimer = () => {
    if (duration <= 0) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    remainingMsRef.current -= Date.now() - startedAtRef.current;
    setIsPaused(true);
  };

  const resumeTimer = () => {
    if (duration <= 0) return;
    setIsPaused(false);
    startTimer();
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Keyframes not expressible via default Tailwind utilities */}
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes toast-out {
          from { opacity: 1; transform: translateY(0) scale(1); max-height: 200px; }
          to {
            opacity: 0;
            transform: translateX(24px) scale(0.98);
            max-height: 0;
            margin: 0;
            padding-top: 0;
            padding-bottom: 0;
          }
        }
        @keyframes toast-progress {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
        .animate-toast-in { animation: toast-in 0.22s ease-out; }
        .animate-toast-out { animation: toast-out 0.2s ease-in forwards; }
        .animate-toast-progress {
          animation-name: toast-progress;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
      `}</style>

      <div
        className={[
          'relative flex w-full items-start gap-2.5 overflow-hidden rounded-[10px]',
          'py-3.5 pl-3.5 pr-3.5 pb-4 font-sans shadow-lg',
          TYPE_STYLES[type],
          isExiting ? 'animate-toast-out' : 'animate-toast-in',
        ].join(' ')}
        role={type === 'error' ? 'alert' : 'status'}
        aria-live={type === 'error' ? 'assertive' : 'polite'}
        onMouseEnter={pauseTimer}
        onMouseLeave={resumeTimer}
      >
        <div className="mt-px flex h-5.5 w-5.5 shrink-0 items-center justify-center text-white" aria-hidden="true">
          {ICONS[type]}
        </div>

        <div className="min-w-0 flex-1">
          {title && (
            <div className="mb-0.5 text-sm font-semibold text-white">
              {title}
            </div>
          )}
          <div className="wrap-break-word text-[13.5px] leading-relaxed text-white/90">
            {message}
          </div>

          {action && (
            <button
              type="button"
              className="mt-2 rounded-md border-[1.5px] border-white/50 bg-white/15 px-3 py-1.5 text-[12.5px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-white/30"
              onClick={() => {
                action.onClick();
                handleClose();
              }}
            >
              {action.label}
            </button>
          )}
        </div>

        {closable && (
          <button
            type="button"
            className="flex shrink-0 items-center justify-center rounded p-0.5 text-white/80 transition-colors duration-150 ease-out hover:bg-white/20 hover:text-white"
            onClick={handleClose}
            aria-label="Close notification"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        )}

        {duration > 0 && (
          <div
            className="animate-toast-progress absolute bottom-0 left-0 h-0.75 w-full origin-left bg-white/60"
            style={{
              animationDuration: `${duration}s`,
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          />
        )}
      </div>
    </>
  );
}