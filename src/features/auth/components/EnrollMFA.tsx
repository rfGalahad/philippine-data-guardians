import { useState } from "react";
import Button from "@/components/ui/Button";
import { enrollTotp } from "@/lib/supabase/auth";
import { useAuth } from "../hooks/useAuth";
import { BackToLogin, FormError, OtpField, SecretKey } from "./MFAParts";

export function EnrollMFA() {
  const { verifyMfa, logout } = useAuth();

  const [factorId, setFactorId] = useState("");
  const [qr, setQr] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const start = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await enrollTotp();
      setFactorId(res.factorId);
      setQr(res.qr);
      setSecret(res.secret);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start setup.");
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await verifyMfa(code, factorId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  // Step 1: start enrollment
  if (!qr) {
    return (
      <div className="flex flex-col gap-6">
        <p className="rounded-md border border-white/10 bg-surface-2/70 px-4 py-3 text-sm text-text-secondary">
          You'll need an authenticator app such as Google Authenticator, 1Password or Authy.
        </p>
        <FormError message={error} />
        <div className="flex flex-col gap-4">
          <Button
            type="button"
            label="Begin setup"
            color="accent"
            loading={loading}
            disabled={loading}
            onClick={start}
          />
          <BackToLogin onClick={logout} />
        </div>
      </div>
    );
  }

  // Step 2: scan + verify
  return (
    <form className="flex flex-col gap-6" onSubmit={submit} noValidate>
      <div className="flex justify-center">
        <div className="rounded-lg bg-white p-3 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)]">
          <img
            src={qr}
            alt="Scan with your authenticator app"
            className="h-44 w-44"
          />
        </div>
      </div>

      <SecretKey secret={secret} />
      <OtpField value={code} onChange={setCode} />
      <FormError message={error} />

      <div className="flex flex-col gap-4">
        <Button
          type="submit"
          label="Verify & enable"
          color="accent"
          loading={loading}
          disabled={loading || code.length !== 6}
        />
        <BackToLogin onClick={logout} />
      </div>
    </form>
  );
}