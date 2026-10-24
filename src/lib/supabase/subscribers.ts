import { byDateDesc } from "@/utils/date";

import { supabase } from "./client";
import { 
  type SubscriptionStatus, 
  type Subscription, 
  type SubscriptionRow, 
  mapSubscription 
} from "./subscriptions";
import { getMemberPhotoPath, removeMemberPhotos } from "./member-photos";
import { logActivity } from "./activity-log";
import { fetchMemberPhotosForRemoval } from "./members";

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

export type SubscriberStatus = "active" | "expiring_soon" | "expired" | "no_subscription";
export type PaymentFlag = "paid" | "pending" | "failed";

export interface SubscriberListSubscription {
  subscriptionId: string;
  serviceId: string;
  serviceName: string;
  planId: string;
  planName: string;
}

export interface SubscriberListRow {
  subscriberId: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  email: string;
  contactNumber: string | null;
  createdAt: string;
  updatedAt: string;
  // Derived (from the subscriber_list view)
  status: SubscriberStatus;
  subscriptionCount: number;
  activeCount: number;
  nextExpiry: string | null; // earliest upcoming expiry among active subscriptions
  paymentFlag: PaymentFlag | null; // worst latest-payment status; null = no payments
  subscriptions: SubscriberListSubscription[]; // newest first
}

// nested select
interface SubscriberListQueryRow {
  subscriber_id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  suffix: string | null;
  email: string;
  contact_number: string | null;
  created_at: string;
  updated_at: string;
  subscriptions:
    | {
        subscription_id: string;
        service_id: string;
        plan_id: string;
        started_at: string;
        expires_at: string | null;
        services: { service_id: string; service_name: string } | null;
        plans: { plan_id: string; plan_name: string } | null;
        payments: { payment_status: string; paid_at: string | null }[] | null;
      }[]
    | null;
}

type QuerySubscription = NonNullable<SubscriberListQueryRow["subscriptions"]>[number];

export interface SubscriberDetail {
  subscriberId: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  email: string;
  contactNumber: string | null;
  createdAt: string;
  updatedAt: string;

  // Derived
  status: SubscriptionStatus; 
  activeSubscriptionCount: number;
  totalPaid: number;
  subscriptions: Subscription[]; 
}

export interface SubscriberRow {
  subscriber_id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  suffix: string | null;
  email: string;
  contact_number: string | null;
  created_at: string;
  updated_at: string;
  subscriptions: SubscriptionRow[] | null;
}

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

const EXPIRING_SOON_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

const isActive = (s: QuerySubscription, now: number): boolean =>
  s.expires_at === null || new Date(s.expires_at).getTime() > now;
 
// Status of a subscription's most recent payment.
// Unpaid rows (paid_at is null) count as the latest, so a pending payment wins.
function latestPaymentStatus(payments: QuerySubscription["payments"]): string | null {
  if (!payments || payments.length === 0) return null;
 
  const time = (p: { paid_at: string | null }) =>
    p.paid_at === null ? Number.POSITIVE_INFINITY : new Date(p.paid_at).getTime();
 
  const latest = payments.reduce((a, b) => (time(b) > time(a) ? b : a));
  return latest.payment_status.toLowerCase();
}
 
// Worst latest-payment status across all subscriptions: failed > pending > paid
function derivePaymentFlag(subscriptions: QuerySubscription[]): PaymentFlag | null {
  const statuses = subscriptions.map((s) => latestPaymentStatus(s.payments));
 
  if (statuses.includes("failed")) return "failed";
  if (statuses.includes("pending")) return "pending";
  if (statuses.includes("paid")) return "paid";
  return null;
}
 
function deriveStatus(
  subscriptionCount: number,
  activeCount: number,
  nextExpiry: string | null,
  now: number
): SubscriberStatus {
  if (subscriptionCount === 0) return "no_subscription";
  if (activeCount === 0) return "expired";
  if (nextExpiry && new Date(nextExpiry).getTime() - now <= EXPIRING_SOON_DAYS * DAY_MS) {
    return "expiring_soon";
  }
  return "active";
}

function mapSubscriberListRow(row: SubscriberListQueryRow, now: number): SubscriberListRow {

  const subscriptions = [...(row.subscriptions ?? [])].sort((a, b) =>
    byDateDesc(a.started_at, b.started_at)
  );
 
  const active = subscriptions.filter((s) => isActive(s, now));
 
  // Earliest upcoming expiry among active subscriptions (ignores "no expiry")
  const nextExpiry =
    active
      .map((s) => s.expires_at)
      .filter((d): d is string => d !== null)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0] ?? null;
 
  return {
    subscriberId: row.subscriber_id,
    firstName: row.first_name,
    middleName: row.middle_name,
    lastName: row.last_name,
    suffix: row.suffix,
    email: row.email,
    contactNumber: row.contact_number,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: deriveStatus(subscriptions.length, active.length, nextExpiry, now),
    subscriptionCount: subscriptions.length,
    activeCount: active.length,
    nextExpiry,
    paymentFlag: derivePaymentFlag(subscriptions),
    subscriptions: subscriptions.map((s) => ({
      subscriptionId: s.subscription_id,
      serviceId: s.service_id,
      serviceName: s.services?.service_name ?? "Unknown service",
      planId: s.plan_id,
      planName: s.plans?.plan_name ?? "Unknown plan",
    })),
  };
}

// ---------------------------------------------------------------------------
// QUERIES
// ---------------------------------------------------------------------------

// FETCH ALL SUBSCRIBERS
// RETURNS: SUBSCRIBERS LIST ROW
export async function fetchSubscribers(): Promise<SubscriberListRow[]> {
  const { data, error } = await supabase
    .from("subscribers")
    .select(`
      subscriber_id,
      first_name,
      middle_name,
      last_name,
      suffix,
      email,
      contact_number,
      created_at,
      updated_at,
      subscriptions (
        subscription_id,
        service_id,
        plan_id,
        started_at,
        expires_at,
        services ( service_id, service_name ),
        plans ( plan_id, plan_name ),
        payments ( payment_status, paid_at )
      )
    `)
    .order("created_at", { ascending: false });
 
  if (error) {
    throw error;
  }
 
  const now = Date.now();
 
  return (data as unknown as SubscriberListQueryRow[]).map((row) => mapSubscriberListRow(row, now));
}

// FETCH SUBSCRIBER'S DETAIL VIA SUBSCRIBER_ID
// RETURNS: SUBSCRIBER DETAIL
export async function fetchSubscriberDetail(subscriberId: string): Promise<SubscriberDetail> {
 
  const { data, error } = await supabase
    .from("subscribers")
    .select(
      `
      subscriber_id,
      first_name,
      middle_name,
      last_name,
      suffix,
      email,
      contact_number,
      created_at,
      updated_at,
      subscriptions (
        subscription_id,
        service_id,
        plan_id,
        started_at,
        expires_at,
        created_at,
        services ( service_id, service_name, description ),
        plans ( plan_id, plan_name, price ),
        payments (
          payment_id,
          reference_number,
          amount,
          payment_method,
          payment_status,
          paid_at,
          renewal_count
        )
      )
    `,
    )
    .eq("subscriber_id", subscriberId)
    .single();
 
  if (error) throw new Error(`Failed to fetch subscriber detail: ${error.message}`);
 
  const row = data as unknown as SubscriberRow;
  const now = Date.now();
 
  const subscriptions = (row.subscriptions ?? [])
    .map((s) => mapSubscription(s, now))
    .sort((a, b) => byDateDesc(a.startedAt, b.startedAt));
 
  const activeSubscriptionCount = subscriptions.filter((s) => s.status === "active").length;
 
  return {
    subscriberId: row.subscriber_id,
    firstName: row.first_name,
    middleName: row.middle_name,
    lastName: row.last_name,
    suffix: row.suffix,
    email: row.email,
    contactNumber: row.contact_number,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: activeSubscriptionCount > 0 ? "active" : "expired",
    activeSubscriptionCount,
    totalPaid: subscriptions.reduce((sum, s) => sum + s.totalPaid, 0),
    subscriptions,
  };
}

// DELETE SUBSCRIBER VIA SUBSCRIBER_ID
// Cascades to subscriptions, payments, members, etc.
export async function deleteSubscriber(subscriberId: string): Promise<void> {
  const { data, error } = await supabase
    .from("subscribers")
    .delete()
    .eq("subscriber_id", subscriberId)
    .select("subscriber_id");
 
  if (error) throw error;
 
  if (!data || data.length === 0) {
    throw new Error(`Subscriber ${subscriberId} was not deleted (no matching row — check RLS policy or id).`);
  }
}

// REMOVE SUBSCRIBER'S DATA & MEMBER PHOTOS
// 1. FETCH MEMBER PHOTO URLS
// 2. DELETE SUBSCRIBER (CASCADES TO SUBSCRIPTIONS, PAYMENTS, MEMBERS)
// 3. REMOVE MEMBER PHOTOS
export async function removeSubscriber(subscriberIds: string[]): Promise<boolean> {
  try {
    for (const subscriberId of subscriberIds) {
      const photoUrls = await fetchMemberPhotosForRemoval(subscriberId);
      await deleteSubscriber(subscriberId);
 
      await logActivity(
        "subscriber_deleted",
        subscriberId,
        `deleted subscriber #${subscriberId}`
      );
 
      const photoPaths = photoUrls
        .map(getMemberPhotoPath)
        .filter((path): path is string => path !== null);
 
      try { await removeMemberPhotos(photoPaths) }
      catch (err) { console.error(`Failed to remove photos for subscriber ${subscriberId}:`, err) }
    }
    return true;
  } catch (err) {
    console.error("Failed to remove subscriber(s):", err);
    return false;
  }
}