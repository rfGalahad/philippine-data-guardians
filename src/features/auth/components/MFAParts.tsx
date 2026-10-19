import { useState } from "react";

export function OtpField({
  value,
  onChange,
  placeholder = "000000",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="otp" className="text-sm font-medium text-text-secondary">
        Verification code
      </label>
      <input
        id="otp"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        placeholder={placeholder}
        autoFocus
        className="w-full rounded-md border border-field-border bg-field-bg px-4 py-3 text-center font-mono text-2xl tracking-[0.5em] text-field-text outline-none transition placeholder:tracking-[0.5em] placeholder:text-field-placeholder focus:border-accent focus:ring-2 focus:ring-accent/40"
      />
    </div>
  );
}

export function FormError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
    >
      {message}
    </p>
  );
}

export function BackToLogin({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mx-auto text-sm text-text-secondary transition hover:text-white focus-visible:outline-none focus-visible:underline"
    >
      ← Back to login
    </button>
  );
}

export function SecretKey({ secret }: { secret: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm text-text-secondary">Or enter this key manually</span>
      <div className="flex items-center gap-2 rounded-md border border-white/10 bg-surface-2/70 py-2 pl-3 pr-2">
        <code className="min-w-0 flex-1 break-all font-mono text-xs tracking-wider text-white">
          {secret}
        </code>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 rounded-sm px-2.5 py-1 text-xs font-medium text-accent transition hover:bg-accent-dim"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}