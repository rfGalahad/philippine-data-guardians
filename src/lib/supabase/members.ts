import { supabase } from "./client";

import { 
  type SubscriptionStatus,
  type DigitalIdStatus,
  type PaymentMethod,
  type PaymentStatus,
  type MembersListRawRow,
  type SubscriptionForMemberRow,
  type MemberDetailRawRow,
  type PlanName,
  toPlanName,
  toPaymentMethod
} from "./types";

import {
  one,
  fullName,
  latestPayment,
  computeSubscriptionStatus,
  computeDigitalIdStatus
} from './helpers';

import { removeMemberPhoto } from "./member-photos";
import { logActivity } from "./activity-log";

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

export interface MemberListRow {
  subscriptionId: string | null;
  memberId: string;
  subscriberId: string; 
  name: string;
  email: string;
  contactNumber: string | null;
  photoUrl: string | null;
  memberStatus: string;
  planName: string;
  subscriptionStatus: SubscriptionStatus;
  startedAt: string | null;
  expiresAt: string | null;
  paymentStatus: string | null;
  lastPaymentAmount: number | null;
  lastPaymentAt: string | null;
  digitalIdStatus: DigitalIdStatus;
  city: string | null;
}

export interface MemberDetail {
  memberId: string;
  oldPhotoUrl: string | null;
  photoUrl: string | null;
  memberStatus: string;
  subscriberId: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  email: string;
  contactNumber: string | null;
  createdAt: string;
  updatedAt: string;
  subscriptions: {
    subscriptionId: string;
    startedAt: string;
    expiresAt: string | null; 
    serviceId: string | null;
    serviceName: string | null;
    planId: string | null;
    planName: PlanName | null;
    price: number | null;
    paymentMethod: PaymentMethod | null;
    referenceNumber: string | null;
  }[];
  address: {
    houseNumber: string | null;
    street: string | null;
    barangay: string | null;
    cityMunicipality: string | null;
    province: string | null;
  } | null;
  digitalId: {
    issuedAt: string | null;
    expiredAt: string | null;
    status: DigitalIdStatus;
  };
}

export interface MemberPayload {
  p_first_name: string;
  p_middle_name: string;
  p_last_name: string;
  p_suffix: string;
  p_email: string;
  p_contact_number: string;

  p_house_number: string;
  p_street: string;
  p_barangay: string;
  p_city_municipality: string;
  p_province: string;
  
  p_photo_url: string;

  p_service_id: string;
  p_plan_id: string;
  p_amount: number;

  p_payment_method: PaymentMethod;
  p_reference_number: string;

  p_payment_status: PaymentStatus;
}

export interface UpdateMemberPayload {  
  p_subscriber_id: string,
  p_member_id: string,

  p_first_name: string;
  p_middle_name: string;
  p_last_name: string;
  p_suffix: string;
  p_email: string;
  p_contact_number: string;

  p_house_number: string;
  p_street: string;
  p_barangay: string;
  p_city_municipality: string;
  p_province: string;
  
  p_photo_url: string;

  p_service_id: string;
  p_plan_id: string;
  p_amount: number;

  p_payment_method: PaymentMethod;
  p_reference_number: string;

  p_payment_status: PaymentStatus;
}

export interface MemberGrowthPoint {
  month: string;   
  members: number; 
}

export interface EmailMembershipStatus {
  exists: boolean;
  is_active: boolean;
  member_id?: string;
  subscriber_id?: string;
  expires_at?: string | null;
}

export class ActiveMembershipError extends Error {
  public readonly expiresAt: string | null;

  constructor(expiresAt: string | null) {
    super("An active membership already exists for this email.");
    this.name = "ActiveMembershipError";
    this.expiresAt = expiresAt;
  }
}


// ---------------------------------------------------------------------------
// QUERIES 
// ---------------------------------------------------------------------------

// FETCH ALL MEMBERS
// RETURNS: MEMBER LIST ROW
export async function fetchMembers(): Promise<MemberListRow[]> {
  const [membersResult, subsResult] = await Promise.all([
    supabase
      .from("members")
      .select(`
        member_id,
        photo_url,
        member_status,
        subscriber:subscribers (
          subscriber_id, 
          first_name, 
          middle_name, 
          last_name, 
          suffix, 
          email, 
          contact_number
        ),
        address (
          house_number, street, barangay, city_municipality, province
        ),
        digital_id (
          issued_at, expired_at
        )
      `)
      .overrideTypes<MembersListRawRow[]>(),
    supabase
      .from("subscriptions")
      .select(`
        subscriber_id, subscription_id, started_at, expires_at,
        service:services!inner ( service_id, service_name ),
        plan:plans ( plan_id, plan_name ),
        payments ( payment_id, reference_number, amount, payment_method, payment_status, paid_at )
      `)
      .eq("service.service_name", "membership")
      .order("started_at", { ascending: false })
      .overrideTypes<SubscriptionForMemberRow[]>(),
  ]);

  if (membersResult.error) throw membersResult.error;
  if (subsResult.error) throw subsResult.error;

  const subsBySubscriber = new Map<string, SubscriptionForMemberRow>();
  for (const sub of subsResult.data ?? []) {
    if (!subsBySubscriber.has(sub.subscriber_id)) {
      subsBySubscriber.set(sub.subscriber_id, sub);
    }
  }

  const rows = (membersResult.data ?? []).map((row) => {
    const subscriber = one(row.subscriber);
    const address = one(row.address);
    const digitalId = one(row.digital_id);
    const sub = subscriber ? subsBySubscriber.get(subscriber.subscriber_id) : undefined;
    const plan = sub ? one(sub.plan) : null;
    const lp = sub ? latestPayment(sub.payments) : null;

    return {
      memberId: row.member_id,
      subscriberId: subscriber?.subscriber_id ?? "",
      subscriptionId: sub?.subscription_id ?? null,
      name: subscriber ? fullName(subscriber) : "Unknown",
      email: subscriber?.email ?? "",
      contactNumber: subscriber?.contact_number ?? null,
      photoUrl: row.photo_url,
      memberStatus: row.member_status,
      planName: plan?.plan_name ?? "—",
      subscriptionStatus: sub
        ? computeSubscriptionStatus(sub.started_at, sub.expires_at)
        : "no-subscription",
      startedAt: sub?.started_at ?? null,
      expiresAt: sub?.expires_at ?? null,
      paymentStatus: lp?.payment_status ?? null,
      lastPaymentAmount: lp?.amount ?? null,
      lastPaymentAt: lp?.paid_at ?? null,
      digitalIdStatus: computeDigitalIdStatus(digitalId?.issued_at ?? null, digitalId?.expired_at ?? null),
      city: address?.city_municipality ?? null,
    };
  });

  rows.sort((a, b) => {
    if (a.startedAt === null && b.startedAt === null) return 0;
    if (a.startedAt === null) return 1;  // nulls last
    if (b.startedAt === null) return -1;
    return b.startedAt.localeCompare(a.startedAt); // descending
  });

  return rows;
}

// FETCH MEMBER'S DETAIL VIA MEMBER_ID
// RETURNS: MEMBER DETAIL
export async function fetchMemberDetail(memberId: string): Promise<MemberDetail> {
  const { data, error } = await supabase
    .from("members")
    .select(`
      member_id,
      photo_url,
      member_status,
      subscriber:subscribers (
        subscriber_id, first_name, middle_name, last_name, suffix, email, contact_number, created_at, updated_at,
        subscriptions (
          subscription_id, started_at, expires_at,
          service:services ( service_id, service_name ),
          plan:plans ( plan_id, plan_name, price ),
          payments ( payment_id, reference_number, amount, payment_method, payment_status, paid_at )
        )
      ),
      address (
        house_number, street, barangay, city_municipality, province
      ),
      digital_id (
        issued_at, expired_at
      )
    `)
    .eq("member_id", memberId)
    .single()
    .returns<MemberDetailRawRow>();

  if (error) throw error;

  const subscriber = one(data.subscriber);
  const address = one(data.address);
  const digitalId = one(data.digital_id);

  if (!subscriber) {
    throw new Error(`Member ${memberId} has no linked subscriber`);
  }

  return {
    memberId: data.member_id,
    oldPhotoUrl: data.photo_url, 
    photoUrl: data.photo_url,
    memberStatus: data.member_status,
    subscriberId: subscriber.subscriber_id,
    firstName: subscriber.first_name,
    middleName: subscriber.middle_name,
    lastName: subscriber.last_name,
    suffix: subscriber.suffix,
    email: subscriber.email,
    contactNumber: subscriber.contact_number,
    createdAt: subscriber.created_at,
    updatedAt: subscriber.updated_at,
    subscriptions: (subscriber.subscriptions ?? []).map((sub) => {
      const service = one(sub.service);
      const plan = one(sub.plan);
      const payment = sub.payments?.[0] ?? null;

      return {
        subscriptionId: sub.subscription_id,
        startedAt: sub.started_at,
        expiresAt: sub.expires_at,
        serviceId: service?.service_id ?? null,
        serviceName: service?.service_name ?? null,
        planId: plan?.plan_id ?? null,
        planName: toPlanName(plan?.plan_name),
        price: plan?.price ?? null,
        paymentMethod: toPaymentMethod(payment?.payment_method),
        referenceNumber: payment?.reference_number ?? null,
      };
    }),
    address: address
      ? {
          houseNumber: address.house_number,
          street: address.street,
          barangay: address.barangay,
          cityMunicipality: address.city_municipality,
          province: address.province,
        }
      : null,
    digitalId: {
      issuedAt: digitalId?.issued_at ?? null,
      expiredAt: digitalId?.expired_at ?? null,
      status: computeDigitalIdStatus(digitalId?.issued_at ?? null, digitalId?.expired_at ?? null),
    },
  };
}

// FETCH MEMBER GROWTH (CUMULATIVE, LAST N MONTHS)
// RETURNS: MEMBER GROWTH POINT[]
export async function fetchMemberGrowth(monthsBack = 6): Promise<MemberGrowthPoint[]> {
  const { data, error } = await supabase
    .from("members")
    .select("registered_at")
    .order("registered_at", { ascending: true });

  if (error) throw error;

  const rows = data ?? [];

  // Build the last N month buckets (oldest -> newest), e.g. Mar..Aug
  const now = new Date();
  const buckets: { key: string; label: string; monthEnd: Date }[] = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    buckets.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleString("en-US", { month: "short" }),
      monthEnd,
    });
  }

  // Cumulative count of members registered at or before each bucket's month-end
  let cursor = 0;
  let runningTotal = 0;
  const result: MemberGrowthPoint[] = [];

  for (const bucket of buckets) {
    while (
      cursor < rows.length &&
      new Date(rows[cursor].registered_at) <= bucket.monthEnd
    ) {
      runningTotal++;
      cursor++;
    }
    result.push({ month: bucket.label, members: runningTotal });
  }

  return result;
}

// CHECK IF EMAIL MEMBERSHIP
export async function checkEmailMembership(email: string): Promise<EmailMembershipStatus> {
  const { data, error } = await supabase.rpc("check_email_membership", { p_email: email });
  if (error) throw error;
  return data as EmailMembershipStatus;
}

// REGISTER/ADD A MEMBER
// RETURNS: 
export async function registerMember(
  payload: MemberPayload,
  options: { confirmRenewal?: boolean } = {}
) {
  
  const { data, error } = await supabase.rpc("register_member", {
    ...payload,
    p_confirm_renewal: options.confirmRenewal ?? false,
  });

  if (error) throw error;

  if (data?.requires_confirmation) {
    throw new ActiveMembershipError(data.expires_at ?? null);
  }

  const subscriberId = data?.subscriber_id;

  if (!subscriberId) {
    throw new Error("Registration succeeded but subscriber_id was not returned.");
  } 

  const { data: activationData, error: activationError } =
    await supabase.rpc("activate_member", {
      p_subscriber_id: subscriberId,
    });

  if (activationError) throw activationError;

  const fullName = payload.p_first_name + " " + payload.p_last_name;

  await logActivity(
    "member_added",
    data.member_id,
    `added a member`,
    fullName
  );

  return {
    registration: data,
    activation: activationData,
  };
}

// UPDATE A MEMBER VIA MEMBER_ID
// RETURNS: 
export async function updateMember(payload: UpdateMemberPayload) {
  const { data, error } = await supabase.rpc('update_member', payload);
  if (error) throw error;

  await logActivity(
    "member_updated",
    payload.p_member_id,
    `updated member #${payload.p_member_id}`
  );

  return data;
}

// FETCH MEMBER FOR REMOVAL
// RETURNS: PHOTO_URL, SUBSCRIBER_ID
async function fetchMemberForRemoval(memberId: string): Promise<{
  photoUrl: string | null;
  subscriberId: string;
}> {
  const { data, error } = await supabase
    .from("members")
    .select(`
      photo_url,
      subscriber:subscribers ( subscriber_id )
    `)
    .eq("member_id", memberId)
    .single()

  if (error) throw error;

  const subscriber = one(data.subscriber);

  if (!subscriber) {
    throw new Error(`Member ${memberId} has no linked subscriber`);
  }

  return { 
    photoUrl: data.photo_url, 
    subscriberId: subscriber.subscriber_id 
  };
}

// DELETE A MEMBER FROM MEMBERS VIA MEMBER_ID
export async function deleteMember(member_id: string): Promise<void> {
  const { data, error } = await supabase
    .from("members")
    .delete()
    .eq("member_id", member_id)
    .select("member_id");

  if (error) throw error;

  if (!data || data.length === 0) {
    throw new Error(`Member ${member_id} was not deleted (no matching row — check RLS policy or id).`);
  }
}

// REMOVE MEMBER'S DATA & PHOTO
// 1. FETCH PHOTO_URL & SUBSCRIBER_ID
// 2. DELETE MEMBER
// 3. REMOVE MEMBER PHOTO 
export async function removeMember(memberIds: string[]): Promise<boolean> {
  try {
    for (const memberId of memberIds) {
      const { photoUrl } = await fetchMemberForRemoval(memberId);
      await deleteMember(memberId);

      await logActivity(
        "member_deleted",
        memberId,
        `deleted member #${memberId}`
      );
      
      if (photoUrl) {
        try { await removeMemberPhoto(photoUrl) } 
        catch (err) { console.error(`Failed to remove photo for member ${memberId}:`, err) }
      }
    }
    return true;
  } catch (err) {
    console.error("Failed to remove member(s):", err);
    return false;
  }
}
