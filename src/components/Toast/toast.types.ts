export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastAction {
  /** Text shown on the button, e.g. "Retry" or "Undo" */
  label: string;
  /** Called when the button is clicked. The toast auto-closes after. */
  onClick: () => void;
}

export interface ToastOptions {
  /** Optional bold title shown above the message */
  title?: string;
  /**
   * Seconds before the toast auto-dismisses.
   * Use 0 to make it persistent (only closable manually).
   * Defaults to 5.
   */
  duration?: number;
  /** Show the close (×) button. Defaults to true. */
  closable?: boolean;
  /** Optional action button (e.g. Retry / Undo) */
  action?: ToastAction;
}

export interface ToastItem extends ToastOptions {
  id: string;
  type: ToastType;
  message: string;
}

export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';