import { supabaseAdmin } from "./supabaseClient.ts";

// --------------------------------------------------------------------------------------------//
// CONSTANTS
// --------------------------------------------------------------------------------------------//

const REDIRECT_URLS = {
  newUser: "https://privacy-lens-sooty.vercel.app/setup-account",
  existingUser: "https://privacy-lens-sooty.vercel.app/login",
};

// --------------------------------------------------------------------------------------------//
// FUNCTIONS
// --------------------------------------------------------------------------------------------//

export async function createOrGetUser(email: string) {
  return supabaseAdmin.auth.admin.createUser({ email, email_confirm: true });
}

export async function generateMagicLink(email: string) {
  return supabaseAdmin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: REDIRECT_URLS.existingUser },
  });
}

export async function generateRecoveryLink(email: string) {
  return supabaseAdmin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: REDIRECT_URLS.newUser },
  });
}