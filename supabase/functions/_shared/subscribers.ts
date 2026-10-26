import { supabaseAdmin } from "./supabaseAdmin.ts";

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------
 
export interface MemberDetails {
  subscriber_id: string;
  name: string;
  email: string;
  memberId: string;
  membershipType: string;
  memberSince: Date | null;
}

// ---------------------------------------------------------------------------
// QUERIES
// ---------------------------------------------------------------------------

export async function getMemberDetails(subscriberId: string): Promise<MemberDetails | null> {
  const { data, error } = await supabaseAdmin
    .from("subscribers")
    .select(
      `subscriber_id, first_name, middle_name, last_name, suffix, email,
       members(member_id),
       subscriptions(created_at, plans(plan_name))`,
    )
    .eq("subscriber_id", subscriberId)
    // Latest subscription first, and only fetch one
    .order("created_at", { referencedTable: "subscriptions", ascending: false })
    .limit(1, { referencedTable: "subscriptions" })
    .maybeSingle();
 
  if (error) throw error;
  if (!data) return null;
 
  const subscription = data.subscriptions?.[0];
 
  return {
    subscriber_id: data.subscriber_id,
    name: [data.first_name, data.middle_name, data.last_name, data.suffix]
      .filter(Boolean)
      .join(" "),
    email: data.email,
    memberId: data.members?.[0]?.member_id ?? "",
    membershipType: subscription?.plans?.plan_name ?? "Member",
    memberSince: subscription?.created_at ? new Date(subscription.created_at) : null,
  };
}