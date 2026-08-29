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

type FetchLogActivityOptions = {
  limit?: number;
  cursor?: string;       // pass the last row's createdAt to fetch older logs
  targetType?: string;   // e.g. "member"
  targetId?: string;     // filter to a single entity's history
  action?: string;       // e.g. "member_deleted"
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

// FETCH ACTIVITY LOGS
// RETURNS: ACTIVITY LOG LIST, MOST RECENT FIRST
export async function fetchLogActivity(
  options: FetchLogActivityOptions = {}
): Promise<ActivityLog[]> {
  const { limit = 50, cursor, targetType, targetId, action } = options;

  let query = supabase
    .from("activity_logs")
    .select(`
      id,
      actor_id,
      actor_name,
      action,
      target_type,
      target_id,
      target_label,
      description,
      created_at
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (cursor) query = query.lt("created_at", cursor);
  if (targetType) query = query.eq("target_type", targetType);
  if (targetId) query = query.eq("target_id", targetId);
  if (action) query = query.eq("action", action);

  const { data, error } = await query;

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    actorId: row.actor_id,
    actorName: row.actor_name,
    action: row.action,
    targetType: row.target_type,
    targetId: row.target_id,
    targetLabel: row.target_label,
    description: row.description,
    createdAt: row.created_at,
  }));
}