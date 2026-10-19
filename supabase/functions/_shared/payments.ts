import { supabaseAdmin } from "./supabaseAdmin.ts";

export async function getPaymentByReference(reference: string) {
  const { data, error } = await supabaseAdmin
    .from("payments")
    .select(`
      payment_status,
      subscriptions (
        subscribers ( email ),
        plans ( plan_name ),
        services ( service_name )
      )
    `)
    .eq("reference_number", reference)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function deletePendingPayment(subscriptionId: string) {
  const { error } = await supabaseAdmin
    .from("payments")
    .delete()
    .eq("subscription_id", subscriptionId)
    .eq("payment_status", "pending")
    .eq("reference_number", "pending");
  if (error) throw error;
}

export async function getPendingPaymentAmount(subscriptionId: string): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from("payments")
    .select("amount")
    .eq("subscription_id", subscriptionId)
    .eq("payment_status", "pending")
    .single();

  if (error || !data) throw new Error("No pending payment record found");
  return Number(data.amount);
}

export async function setPaymentReference(subscriptionId: string, referenceNumber: string) {
  const { data, error } = await supabaseAdmin
    .from("payments")
    .update({ reference_number: referenceNumber })
    .eq("subscription_id", subscriptionId)
    .eq("payment_status", "pending")
    .select("payments_id");

  if (error) throw error;
  if (!data?.length) throw new Error("No pending payment record found to update");
}