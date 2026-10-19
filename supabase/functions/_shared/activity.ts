import { getAdminProfile } from "./auth";
import { supabase } from "./client";

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

export type ActivityLog = {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  targetType: string;
  targetId: string;
  targetLabel: string | null;
  description: string;
  createdAt: string;
};

// ---------------------------------------------------------------------------
// QUERIES 
// ---------------------------------------------------------------------------

export async function logActivity(
  action: string,
  targetId: string,
  description: string,
  targetLabel?: string
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const adminProfile = await getAdminProfile(user.id);
  const actorName = adminProfile?.name ?? user.email ?? "Unknown admin";

  await supabase.from("activity_logs").insert({
    actor_id: user.id,
    actor_name: actorName,
    action,
    target_type: "member",
    target_id: targetId,
    target_label: targetLabel ?? targetId,
    description,
  });
}