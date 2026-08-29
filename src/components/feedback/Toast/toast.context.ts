import { createContext } from 'react';
import type { ToastOptions, ToastType } from './toast.types';

export interface ToastContextValue {
  addToast: (message: string, type?: ToastType, options?: ToastOptions) => string;
  removeToast: (id: string) => void;
  success: (message: string, options?: ToastOptions) => string;
  error: (message: string, options?: ToastOptions) => string;
  warning: (message: string, options?: ToastOptions) => string;
  info: (message: string, options?: ToastOptions) => string;
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);