import { supabaseAdmin } from "./supabase-client.ts";

// UPDATES PAYMENT_STATUS TO "PAID"
export async function markPaymentPaid(referenceNumber: string) {
  return supabaseAdmin
    .from("payments")
    .update({ payment_status: "paid", paid_at: new Date().toISOString() })
    .eq("reference_number", referenceNumber)
    .select();
}

// UPDATES MEMBER_ID TO "PDG-YYYY-###"
export async function activateMember(subscriberId: string) {
  return supabaseAdmin.rpc("activate_member", { p_subscriber_id: subscriberId });
}