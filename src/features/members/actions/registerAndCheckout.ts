import { supabase } from "@/lib/supabase/client";
import { ActiveMembershipError } from "@/lib/supabase/members";
import type { RegistrationValues } from "../schema";


export async function registerAndCheckout(
  values: RegistrationValues,
  plan: string,
  opts: { confirmRenewal?: boolean } = {}
) {
  const { uploadPicture, ...rest } = values;

  if (!(uploadPicture instanceof File)) {
    throw new Error("Please upload a valid photo file.");
  }

  const body = new FormData();
  body.append("photo", uploadPicture);
  body.append("values", JSON.stringify({ ...rest, plan }));
  body.append("confirmRenewal", String(!!opts.confirmRenewal));

  const { data, error } = await supabase.functions.invoke("register-and-checkout", { body });

  if (error) {
    const payload = await error.context?.json?.().catch(() => null);
    if (payload?.code === "ACTIVE_MEMBERSHIP") {
      throw new ActiveMembershipError(payload.expiresAt ?? null);
    }
    throw error;
  }

  return data as { url: string };
}