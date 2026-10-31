import { supabaseAdmin } from "./supabaseAdmin.ts";
import type { PaymentMethod, PaymentStatus } from "./payments.ts"


// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

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

export interface MembershipRegistrationResult {
  subscriber_id: string;
  member_id: string;
  subscription_id: string;
  payment_id: string;
  amount: number | string;
  is_existing_subscriber: boolean;
}

export interface EmailMembershipStatus {
  exists: boolean;
  is_active: boolean;
  member_id?: string;
  subscriber_id?: string;
  expires_at?: string | null;
}

export type ConfirmPaymentResult =
  | { status: "confirmed"; subscriber_id: string; member_id: string }
  | { status: "already_paid" }
  | { status: "not_found" }
  | { status: "not_pending" };


// ---------------------------------------------------------------------------
// QUERIES 
// ---------------------------------------------------------------------------

export class ActiveMembershipError extends Error {
  public readonly expiresAt: string | null;

  constructor(expiresAt: string | null) {
    super("An active membership already exists for this email.");
    this.name = "ActiveMembershipError";
    this.expiresAt = expiresAt;
  }
}

// CHECK IF EMAIL MEMBERSHIP
export async function checkEmailMembership(email: string): Promise<EmailMembershipStatus> {
  const { data, error } = await supabaseAdmin.rpc("check_email_membership", { p_email: email });
  if (error) throw error;
  return data as EmailMembershipStatus;
}

function parseResult(data: unknown, fn: string): MembershipRegistrationResult {
  const r = data as Partial<MembershipRegistrationResult> | null;
  if (!r?.subscriber_id || !r?.member_id || !r?.subscription_id || !r?.payment_id) {
    throw new Error(`${fn} returned an incomplete result`);
  }
  return r as MembershipRegistrationResult;
}

export async function registerMember(payload: MemberPayload) {
  const { data, error } = await supabaseAdmin.rpc("register_member", payload);
  if (error) throw error;
  return parseResult(data, "register_member");
}

export async function renewMembership(payload: MemberPayload) {
  const { data, error } = await supabaseAdmin.rpc("renew_membership", payload);
  if (error) throw error;
  return parseResult(data, "renew_membership");
}

// DELETE MEMBER
export async function deleteMember(memberId: string) {
  const { error } = await supabaseAdmin.from("members").delete().eq("member_id", memberId);
  if (error) throw error;
}

export async function confirmMembershipPayment(referenceNumber: string): Promise<ConfirmPaymentResult> {
  const { data, error } = await supabaseAdmin.rpc("confirm_membership_payment", {
    p_reference_number: referenceNumber,
  });
  if (error) throw error;
  return data as ConfirmPaymentResult;
}

