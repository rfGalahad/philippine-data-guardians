interface LoadingPageProps {
  /** Short status message shown beneath the spinner */
  label?: string;
}

export default function LoadingPage({ label = "Loading" }: LoadingPageProps) {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div
        className="h-8 w-8 animate-spin rounded-full border-[2.5px] border-border border-t-accent motion-reduce:duration-[1.4s]"
        aria-hidden="true"
      />
      <span className="font-body text-[0.8125rem] font-medium tracking-[0.02em] text-text-secondary">
        {label}
      </span>
    </div>
  );
}