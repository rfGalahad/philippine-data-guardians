import { supabase } from "./client";

import type { 
  SubscriptionStatus,
  DigitalIdStatus,
  PaymentMethod,
  PaymentStatus,
  Payment,
  MembersListRawRow,
  SubscriptionForMemberRow,
  MemberDetailRawRow
} from "./types";

import {
  one,
  fullName,
  latestPayment,
  computeSubscriptionStatus,
  computeDigitalIdStatus
} from './helpers';

import { removeMemberPhoto } from "./member-photos";

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
  subscriptions: {
    subscriptionId: string;
    startedAt: string;
    expiresAt: string | null;
    serviceName: string;
    planName: string;
    subscriptionStatus: SubscriptionStatus;
    payments: Payment[];
  }[];
}

export interface RegisterMemberPayload {
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

  return (membersResult.data ?? []).map((row) => {
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
          plan:plans ( plan_id, plan_name ),
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
    subscriptions: (subscriber.subscriptions ?? [])
      .slice()
      .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())
      .map((s) => {
        const service = one(s.service);
        const plan = one(s.plan);
        return {
          subscriptionId: s.subscription_id,
          startedAt: s.started_at,
          expiresAt: s.expires_at,
          serviceName: service?.service_name ?? "—",
          planName: plan?.plan_name ?? "—",
          subscriptionStatus: computeSubscriptionStatus(s.started_at, s.expires_at),
          payments: s.payments ?? [],
        };
      }),
  };
}

// REGISTER/ADD A MEMBER
// RETURNS: 
export async function registerMember(payload: RegisterMemberPayload) {
  const { data, error } = await supabase.rpc('register_member', payload);
  if (error) throw error;
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
