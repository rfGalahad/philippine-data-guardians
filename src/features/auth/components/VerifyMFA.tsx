import { useState } from "react";
import Button from "@/components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { BackToLogin, FormError, OtpField } from "./MFAParts";

export function VerifyMFA() {
  const { verifyMfa, logout } = useAuth();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await verifyMfa(code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={submit} noValidate>
      <OtpField value={code} onChange={setCode} />
      <FormError message={error} />
      <div className="flex flex-col gap-4">
        <Button
          type="submit"
          label="Verify"
          color="accent"
          loading={loading}
          disabled={loading || code.length !== 6}
        />
        <BackToLogin onClick={logout} />
      </div>
    </form>
  );
}