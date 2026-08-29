import { useState } from "react";
import { useToast } from "@/components/feedback/Toast";

import { registerAndCheckout } from "../actions/registerAndCheckout";
import type { AppForm } from "./useRegistrationForm";

export function useRegisterAndCheckout(form: AppForm) {
  
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const checkout = async () => {
    const isValid = await form.validateAllFields('submit');
    if (!isValid) return;

    const { plan } = form.state.values;
    if (!plan) return; 

    setLoading(true);
    try {
      const data = await registerAndCheckout(form.state.values, plan);
      if (data.url) window.location.href = data.url;
      else toast.error("Checkout failed to initialize.");
    } catch (error) {
      console.error("Error Submitting!", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { checkout, loading };
}