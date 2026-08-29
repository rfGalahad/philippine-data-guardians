import { useState } from "react";
import { useToast } from "@/components/feedback/Toast";

import type { RegistrationValues } from "../schema";
import { registerMemberWithPhoto } from "../actions/registerMemberWithPhoto";


export function useRegisterMember(onSuccess?: () => void) {

  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const register = async (
    values: RegistrationValues, 
    plan: string
  ) => {
    setLoading(true);
    try {
      const result = await registerMemberWithPhoto(values, plan);
      toast.success("Member registered successfully.");
      onSuccess?.();
      return result;
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading };
}