import { useEffect, useState } from "react";
import ConfirmDialog from "@/components/feedback/ConfirmDialog";

// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------

const RESEND_SECONDS = 30;

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

interface Props {
  email: string;
  error: string | null;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  onCancel: () => void;
}

// ---------------------------------------------------------------------------
// VERIFY EMAIL DIALOG
// ---------------------------------------------------------------------------

export const VerifyEmailDialog = ({
  email,
  error,
  onVerify,
  onResend,
  onCancel,
}: Props) => {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleVerify = async () => {
    if (code.length !== 6 || busy) return;
    setBusy(true);
    try {
      await onVerify(code);
    } finally {
      setBusy(false);
      setCode("");
    }
  };

  const handleResend = async () => {
    setCooldown(RESEND_SECONDS);
    await onResend();
  };

  return (
    <ConfirmDialog
      open
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
      onConfirm={handleVerify}
      title="Verify your email"
      description={`We sent a 6-digit code to ${email}. Enter it below to continue renewing.`}
      confirmLabel="Verify & Renew"
      loadingLabel="Verifying…"
      loading={busy}
      confirmDisabled={code.length !== 6}
      variant="primary"
    >
      <input
        data-autofocus
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        value={code}
        disabled={busy}
        placeholder="000000"
        aria-label="6-digit verification code"
        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleVerify();
        }}
        className="mt-4 w-full rounded-md border border-field-border px-3 py-2 text-center font-body text-lg tracking-[0.5em] text-text-primary outline-none focus:border-text-primary disabled:opacity-60"
      />

      {error && (
        <p role="alert" className="mt-2 font-body text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleResend}
        disabled={cooldown > 0 || busy}
        className="mt-3 cursor-pointer font-body text-sm text-text-secondary underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline"
      >
        {cooldown > 0 ? `Resend code (${cooldown}s)` : "Resend code"}
      </button>
    </ConfirmDialog>
  );
};