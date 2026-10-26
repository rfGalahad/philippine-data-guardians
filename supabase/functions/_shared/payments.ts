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

export async function setPaymentReference(paymentId: string, reference: string) {
  const { error } = await supabaseAdmin
    .from("payments")
    .update({ reference_number: reference })
    .eq("payment_id", paymentId);
  if (error) throw new Error(`Failed to set payment reference: ${error.message}`);
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