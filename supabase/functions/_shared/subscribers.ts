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
  address: string;
  photoPath: string;
}

// ---------------------------------------------------------------------------
// QUERIES
// ---------------------------------------------------------------------------

export async function getMemberDetails(subscriberId: string): Promise<MemberDetails | null> {
  const { data, error } = await supabaseAdmin
    .from("subscribers")
    .select(
      `subscriber_id, first_name, middle_name, last_name, suffix, email,
       members(
         member_id,
         photo_url,
         address(house_number, street, barangay, city_municipality, province)
       ),
       subscriptions(created_at, plans(plan_name))`,
    )
    .eq("subscriber_id", subscriberId)
    .order("created_at", { referencedTable: "subscriptions", ascending: false })
    .limit(1, { referencedTable: "subscriptions" })
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const subscription = data.subscriptions?.[0];
  const member = data.members?.[0];

  // PostgREST returns an object for one-to-one relations and an array for one-to-many
  const rawAddress = Array.isArray(member?.address) ? member.address[0] : member?.address;

  const address: AddressParts | null = rawAddress
    ? {
        houseNumber: rawAddress.house_number,
        street: rawAddress.street,
        barangay: rawAddress.barangay,
        cityMunicipality: rawAddress.city_municipality,
        province: rawAddress.province,
      }
    : null;

  return {
    subscriber_id: data.subscriber_id,
    name: [data.first_name, data.middle_name, data.last_name, data.suffix]
      .filter(Boolean)
      .join(" "),
    email: data.email,
    memberId: member?.member_id ?? "",
    membershipType: subscription?.plans?.plan_name ?? "Member",
    memberSince: subscription?.created_at ? new Date(subscription.created_at) : null,
    address,
    photoPath: member?.photo_url ? photoPathFromUrl(member.photo_url) : null,
  };
}