import { supabaseAdmin } from "./supabaseAdmin.ts";

// --------------------------------------------------------------------------------------------//
// TYPES
// --------------------------------------------------------------------------------------------//

export const PAYMENT_METHODS = ['qr', 'cash', 'paymongo'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export type PaymentStatus = 'paid' | 'pending'

export interface Payment {
  payment_id: string;
  reference_number: string | null;
  amount: number | null;
  payment_method: string | null;
  payment_status: string | null;
  paid_at: string | null;
}

// --------------------------------------------------------------------------------------------//
// FUNCTIONS
// --------------------------------------------------------------------------------------------//

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

export async function deletePendingPayment(subscriptionId: string, reference = "pending") {
  const { error } = await supabaseAdmin
    .from("payments")
    .delete()
    .eq("subscription_id", subscriptionId)
    .eq("payment_status", "pending")
    .eq("reference_number", reference);
  if (error) throw error;
}

export async function getPendingPaymentAmount(subscriptionId: string): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from("payments")
    .select("amount")
    .eq("subscription_id", subscriptionId)
    .eq("payment_status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) throw new Error("No pending payment record found");
  return Number(data.amount);
}

export async function setPaymentReference(subscriptionId: string, referenceNumber: string) {
  const { data: latest, error: findErr } = await supabaseAdmin
    .from("payments")
    .select("payments_id")
    .eq("subscription_id", subscriptionId)
    .eq("payment_status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (findErr) throw findErr;
  if (!latest) throw new Error("No pending payment record found to update");

  const { error } = await supabaseAdmin
    .from("payments")
    .update({ reference_number: referenceNumber })
    .eq("payments_id", latest.payments_id);
  if (error) throw error;
}

export async function getStalePendingSubscriptionIds(cutoffIso: string): Promise<string[]> {
  const { data, error } = await supabaseAdmin
    .from("payments")
    .select("subscription_id")
    .eq("payment_status", "pending")
    .lt("created_at", cutoffIso);
  if (error) throw error;
  return [...new Set((data ?? []).map((p) => p.subscription_id))];
}

export async function deleteStalePendingPayments(subscriptionId: string, cutoffIso: string) {
  const { error } = await supabaseAdmin
    .from("payments")
    .delete()
    .eq("subscription_id", subscriptionId)
    .eq("payment_status", "pending")
    .lt("created_at", cutoffIso);
  if (error) throw error;
}