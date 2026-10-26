import { useState } from "react";
import { useToast } from "@/components/feedback/Toast";
import { ActiveMembershipError } from "@/lib/supabase/members";

import { registerAndCheckout } from "../actions/registerAndCheckout";
import type { AppForm } from "./useRegistrationForm";

// ---------------------------------------------------------------------------
// HOOK
// ---------------------------------------------------------------------------

export function useRegisterAndCheckout(form: AppForm) {

  const [loading, setLoading] = useState(false);
  const [renewPrompt, setRenewPrompt] = useState<{ expiresAt: string | null } | null>(null);

  const toast = useToast();

  const run = async (confirm: boolean) => {
    const isValid = await form.validateAllFields("submit");
    if (!isValid) return;

    const { plan } = form.state.values;
    if (!plan) return;

    setLoading(true);

    try {
      const data = await registerAndCheckout(form.state.values, plan, { confirmRenewal: confirm });
      if (data.url) window.location.href = data.url;
      else toast.error("Checkout failed to initialize.");
    } catch (error) {
      if (error instanceof ActiveMembershipError) {
        setRenewPrompt({ expiresAt: error.expiresAt });
        return; // finally still resets loading
      }
      console.error("Error Submitting!", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const checkout = () => run(false);

  const confirmRenewal = () => {
    setRenewPrompt(null);
    return run(true);
  };

  const cancelRenewal = () => setRenewPrompt(null);

  return { 
    checkout, 
    loading, 
    renewPrompt, 
    confirmRenewal, 
    cancelRenewal 
  };
}