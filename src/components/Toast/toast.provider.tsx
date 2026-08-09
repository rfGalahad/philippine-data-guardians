import {
  type ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import type { 
  ToastItem, 
  ToastOptions, 
  ToastPosition, 
  ToastType 
} from './toast.types';

import Toast from './Toast';
import { ToastContext } from './toast.context';


const DEFAULT_DURATION = 5; 

const POSITION_CLASSES: Record<ToastPosition, string> = {
  'top-right': 'top-4 right-4 items-end',
  'top-left': 'top-4 left-4 items-start',
  'bottom-right': 'bottom-4 right-4 items-end',
  'bottom-left': 'bottom-4 left-4 items-start',
  'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
};

interface ToastProviderProps {
  children: ReactNode;
  /** Corner of the screen the toasts stack in. Defaults to 'top-right'. */
  position?: ToastPosition;
  /** Oldest toasts are dropped once this many are on screen. Defaults to 5. */
  maxToasts?: number;
}

export function ToastProvider({
  children,
  position = 'bottom-right',
  maxToasts = 5,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idCounter = useRef(0);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', options: ToastOptions = {}) => {
      const id = `toast-${Date.now()}-${idCounter.current++}`;

      const newToast: ToastItem = {
        id,
        type,
        message,
        title: options.title,
        duration: options.duration ?? DEFAULT_DURATION,
        closable: options.closable ?? true,
        action: options.action,
      };

      setToasts((prev) => {
        const next = [...prev, newToast];
        return next.length > maxToasts ? next.slice(next.length - maxToasts) : next;
      });

      return id;
    },
    [maxToasts]
  );

  const success = useCallback(
    (message: string, options?: ToastOptions) => addToast(message, 'success', options),
    [addToast]
  );
  const error = useCallback(
    (message: string, options?: ToastOptions) => addToast(message, 'error', options),
    [addToast]
  );
  const warning = useCallback(
    (message: string, options?: ToastOptions) => addToast(message, 'warning', options),
    [addToast]
  );
  const info = useCallback(
    (message: string, options?: ToastOptions) => addToast(message, 'info', options),
    [addToast]
  );

  const value = useMemo(
    () => ({ addToast, removeToast, success, error, warning, info }),
    [addToast, removeToast, success, error, warning, info]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      {typeof document !== 'undefined' &&
        createPortal(
          <div
            className={`pointer-events-none fixed z-9999 flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0 *:pointer-events-auto ${POSITION_CLASSES[position]}`}
          >
            {toasts.map((t) => (
              <Toast key={t.id} toast={t} onClose={() => removeToast(t.id)} />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

