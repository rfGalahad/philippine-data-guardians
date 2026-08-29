import type { MemberPayload, UpdateMemberPayload } from "@/lib/supabase/members";
import type { PaymentMethod, PaymentStatus } from "@/lib/supabase/types";
import { toTitleCase } from "@/utils/string";


//-----------------------------------------------------------
// CREATE MEMBER PAYLOAD
//-----------------------------------------------------------

interface createMemberPayloadParams {
  values: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    suffix?: string;
    emailAddress?: string;
    contactNumber?: string;

    houseNumber?: string;
    street?: string;
    barangay?: string;
    cityMunicipality?: string;
    province?: string;
  }

  photoUrl: string;
  
  plan: {
    service_id: string;
    plan_id: string;
    price: number;
  };
  
  payment: {
    method: PaymentMethod;
    referenceNumber: string;
  };

  paymentStatus: PaymentStatus;
}

export function createMemberPayload({
  values,
  photoUrl,
  plan,
  payment,
  paymentStatus = "pending",
}: createMemberPayloadParams): MemberPayload {
  return {
    p_first_name: toTitleCase(values.firstName ?? ""),
    p_middle_name: toTitleCase(values.middleName ?? ""),
    p_last_name: toTitleCase(values.lastName ?? ""),
    p_suffix: values.suffix ?? "", 
    p_email: values.emailAddress ?? "",
    p_contact_number: values.contactNumber ?? "",

    p_house_number: values.houseNumber ?? "",
    p_street: values.street ?? "",
    p_barangay: values.barangay ?? "",
    p_city_municipality: values.cityMunicipality ?? "",
    p_province: values.province ?? "",

    p_photo_url: photoUrl,

    p_service_id: plan.service_id,
    p_plan_id: plan.plan_id,
    p_amount: plan.price,

    p_payment_method: payment.method,
    p_reference_number: payment.referenceNumber,

    p_payment_status: paymentStatus
  };
}

//-----------------------------------------------------------
// CREATE UPDATE MEMBER PAYLOAD
//-----------------------------------------------------------

interface createUpdateMemberPayloadParams {
  values: {
    subscriberId: string, 
    memberId: string,

    firstName?: string;
    middleName?: string;
    lastName?: string;
    suffix?: string;
    emailAddress?: string;
    contactNumber?: string;

    houseNumber?: string;
    street?: string;
    barangay?: string;
    cityMunicipality?: string;
    province?: string;
  }

  photoUrl: string;
  
  plan: {
    service_id: string;
    plan_id: string;
    price: number;
  };
  
  payment: {
    method: PaymentMethod;
    referenceNumber: string;
  };

  paymentStatus: PaymentStatus;
}

export function createUpdateMemberPayload({
  values,
  photoUrl,
  plan,
  payment,
  paymentStatus = "pending",
}: createUpdateMemberPayloadParams): UpdateMemberPayload {
  return {
    p_subscriber_id: values.subscriberId,
    p_member_id: values.memberId,

    p_first_name: toTitleCase(values.firstName ?? ""),
    p_middle_name: toTitleCase(values.middleName ?? ""),
    p_last_name: toTitleCase(values.lastName ?? ""),
    p_suffix: values.suffix ?? "", 
    p_email: values.emailAddress ?? "",
    p_contact_number: values.contactNumber ?? "",

    p_house_number: values.houseNumber ?? "",
    p_street: values.street ?? "",
    p_barangay: values.barangay ?? "",
    p_city_municipality: values.cityMunicipality ?? "",
    p_province: values.province ?? "",

    p_photo_url: photoUrl,

    p_service_id: plan.service_id,
    p_plan_id: plan.plan_id,
    p_amount: plan.price,

    p_payment_method: payment.method,
    p_reference_number: payment.referenceNumber,
    p_payment_status: paymentStatus
  };
}