import type { Session } from "@supabase/supabase-js";
import { mapSupabaseUser } from "@/lib/supabase/auth";
import type { useToast } from "@/components/feedback/Toast";
import type { AdminProfile } from "../types/authTypes";


const PENDING_SIGNIN_KEY = "auth:pending_signin";


export const toAuthSuccessPayload = (
  session: Session,
  adminProfile: AdminProfile
) => {
  return {
    user: mapSupabaseUser(session.user, adminProfile),
    token: session.access_token,
  };
}

export const notifyPendingSignInSuccess = (toast: ReturnType<typeof useToast>) => {
  const pendingSignIn = sessionStorage.getItem(PENDING_SIGNIN_KEY);
  if (!pendingSignIn) return;
  sessionStorage.removeItem(PENDING_SIGNIN_KEY);
  toast.success("Signed in successfully!");
};

