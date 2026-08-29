import type { AuthChangeEvent } from "@supabase/supabase-js";
import type { User, AdminProfile } from "@/features/auth/types/authTypes";
import { supabase } from "./client";


export function mapSupabaseUser(
  supabaseUser: NonNullable<Awaited<ReturnType<typeof supabase.auth.getUser>>["data"]["user"]>,
  adminProfile: AdminProfile
): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? "",
    name: adminProfile.name,
    role: adminProfile.role
  }; 
}

// FETCH SESSION 
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

// SIGN IN USING EMAIL + PASSWORD
export async function signInWithPassword(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

// SIGN OUTS CURRENT USER
// REMOVES SESSION
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// FETCH CURRENT USER 
// RETURNS: 
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error("No user found");

  const adminProfile = await getAdminProfile(data.user.id);
  if (!adminProfile) throw new Error("No admin access");

  return mapSupabaseUser(data.user, adminProfile);
}

export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"]) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}

// FETCH ADMIN'S PROFILE
// RETURNS: ADMIN'S EMAIL, ETC. ...
export async function getAdminProfile(userId: string) {
  const { data, error } = await supabase
    .from("admins")
    .select("id, email, name, role")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Admin check failed:", error);
    return null;
  }

  return data;
}