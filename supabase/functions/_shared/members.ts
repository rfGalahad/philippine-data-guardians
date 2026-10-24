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

export interface RegisterMemberResult {
  member_id: string;
  subscriber_id: string;
  subscription_id: string;
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

// REGISTER MEMBER
export async function registerMember(payload: MemberPayload): Promise<RegisterMemberResult> {
  const { data, error } = await supabaseAdmin.rpc("register_member", payload);
  if (error) throw error;
  if (!data?.subscriber_id) throw new Error("subscriber_id not returned");
  return data as RegisterMemberResult;
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

