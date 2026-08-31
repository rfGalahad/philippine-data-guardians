import type { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { useAppForm } from "@/lib/form";
import { useToast } from "@/components/feedback/Toast";

import { loginSchema } from "../schema/loginSchema";
import { useAuth } from "./useAuth";
import { useEffect } from "react";


//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const DEFAULT_VALUES = {
  email: "",
  password: ""
}

//-----------------------------------------------------------
// SETUP ACCOUNT HOOK
//-----------------------------------------------------------

export function useLogin() {

  const navigate = useNavigate();
  const toast = useToast();

  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate("/admin/dashboard");
  }, [isAuthenticated, navigate]);
  
  const signInMutation = useMutation({
    mutationFn: ({ email, password }: z.infer<typeof loginSchema>) =>
      login(email, password),
    onSuccess: () => {
      navigate("/admin/dashboard");
      
    },
    onError: (error) => {
      console.error(error.message);
      toast.error("Failed to sign in. Check your email and password.", {
        title: "Login Error",
      });
    },
  });

  const form = useAppForm({
    defaultValues: DEFAULT_VALUES,
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      await signInMutation.mutateAsync(value);
    },
  });

  return { form, signInMutation };
}