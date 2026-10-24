import { toNumber } from "@/utils/number";
import { byDateDesc } from "@/utils/date";

import { supabase } from "./client";
import { isCountedPayment, mapPayment, type Payment, type PaymentRow } from "./payments";

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

export type SubscriptionStatus = "active" | "expired";

export interface Subscription {
  subscriptionId: string;
  serviceId: string;
  serviceName: string;
  serviceDescription: string | null;
  planId: string;
  planName: string;
  price: number;
  startedAt: string;
  expiresAt: string | null;
  createdAt: string;
  status: SubscriptionStatus;
  renewalCount: number;
  totalPaid: number;
  payments: Payment[];
}

export interface SubscriptionRow {
  subscription_id: string;
  service_id: string;
  plan_id: string;
  started_at: string;
  expires_at: string | null;
  created_at: string;
  services: { service_id: string; service_name: string; description: string | null } | null;
  plans: { plan_id: string; plan_name: string; price: number | string } | null;
  payments: PaymentRow[] | null;
}

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

export function mapSubscription(row: SubscriptionRow, now: number): Subscription {

  const payments = (row.payments ?? []).map(mapPayment).sort((a, b) => byDateDesc(a.paidAt, b.paidAt));
 
  const isActive = row.expires_at === null || new Date(row.expires_at).getTime() > now;
 
  return {
    subscriptionId: row.subscription_id,
    serviceId: row.service_id,
    serviceName: row.services?.service_name ?? "Unknown service",
    serviceDescription: row.services?.description ?? null,
    planId: row.plan_id,
    planName: row.plans?.plan_name ?? "Unknown plan",
    price: toNumber(row.plans?.price),
    startedAt: row.started_at,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    status: isActive ? "active" : "expired",
    renewalCount: payments.reduce((max, p) => Math.max(max, p.renewalCount), 0),
    totalPaid: payments.filter(isCountedPayment).reduce((sum, p) => sum + p.amount, 0),
    payments,
  };
}

// ---------------------------------------------------------------------------
// QUERIES
// ---------------------------------------------------------------------------

export async function removeSubscription(subscriptionId: string): Promise<void> {
  // Delete the payment first unless payments.subscription_id has ON DELETE CASCADE
  const { error: payErr } = await supabase
    .from("payments")
    .delete()
    .eq("subscription_id", subscriptionId);
  if (payErr) console.error("Failed to remove payment:", payErr);

  const { error } = await supabase
    .from("subscriptions")
    .delete()
    .eq("subscription_id", subscriptionId);
  if (error) console.error("Failed to remove subscription:", error);
}  