import { supabaseAdmin } from "./supabase-client.ts";
import { CONFIG } from "../config.ts";

export async function createOrGetUser(email: string) {
  return supabaseAdmin.auth.admin.createUser({ email, email_confirm: true });
}

export async function generateMagicLink(email: string) {
  return supabaseAdmin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: CONFIG.redirectUrls.existingUser },
  });
}

export async function generateRecoveryLink(email: string) {
  return supabaseAdmin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: CONFIG.redirectUrls.newUser },
  });
}