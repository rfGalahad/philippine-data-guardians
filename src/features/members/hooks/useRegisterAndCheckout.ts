import { useState } from "react";
import { useToast } from "@/components/feedback/Toast";
import { ActiveMembershipError } from "@/lib/supabase/members";
import { sendEmailOtp, verifyEmailOtp, clearVerifiedSession } from "@/lib/supabase/auth";

import { registerAndCheckout } from "../actions/registerAndCheckout";
import type { AppForm } from "./useRegistrationForm";

// --------------------------------------------------------------------------------------------//
// TYPES
// --------------------------------------------------------------------------------------------//

type Step = "idle" | "renew" | "otp";

// --------------------------------------------------------------------------------------------//
// FUNCTION
// --------------------------------------------------------------------------------------------//

export function useRegisterAndCheckout(form: AppForm) {
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>("idle");
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);

  const toast = useToast();

  const run = async (confirm: boolean) => {
    const isValid = await form.validateAllFields("submit");
    if (!isValid) return;

    const { plan } = form.state.values;
    if (!plan) return;

    setLoading(true);
    try {
      const data = await registerAndCheckout(form.state.values, plan, {
        confirmRenewal: confirm,
      });
      if (data.url) {
        await clearVerifiedSession(); // don't leave a verified session on this device
        window.location.href = data.url;
      } else {
        toast.error("Checkout failed to initialize.");
      }
    } catch (error) {
      if (error instanceof ActiveMembershipError) {
        setExpiresAt(error.expiresAt);
        setStep("renew");
        return;
      }
      console.error("Error Submitting!", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const checkout = () => run(false);

  // Dialog 1: "Renew" clicked -> send the code
  const confirmRenewal = async () => {
    try {
      await sendEmailOtp(form.state.values.emailAddress);
      setOtpError(null);
      setStep("otp");
    } catch {
      toast.error("Couldn't send the code. Please try again.");
    }
  };

  // Dialog 2: code submitted
  const verifyOtp = async (token: string) => {
    setOtpError(null);
    try {
      await verifyEmailOtp(form.state.values.emailAddress, token);
    } catch {
      setOtpError("Invalid or expired code.");
      return;
    }
    setStep("idle");
    await run(true); // invoke() now sends the verified user's JWT
  };

  const resendOtp = async () => {
    try {
      await sendEmailOtp(form.state.values.emailAddress);
      setOtpError(null);
    } catch {
      toast.error("Couldn't resend the code. Please wait a moment and try again.");
    }
  };

  const cancelRenewal = async () => {
    setStep("idle");
    setOtpError(null);
    await clearVerifiedSession();
  };

  return {
    checkout,
    loading,
    step,
    expiresAt,
    otpError,
    confirmRenewal,
    verifyOtp,
    resendOtp,
    cancelRenewal,
  };
}