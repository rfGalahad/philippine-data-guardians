import type { RegisterMemberPayload } from "@/lib/supabase/members";
import type { PaymentMethod, PaymentStatus } from "@/lib/supabase/types";
import { toTitleCase } from "@/utils/string";

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface CreateRegistrationPayloadParams {
  personalInfo: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    suffix?: string;
    emailAddress?: string;
    contactNumber?: string;
  };
  addressDetails: {
    houseNumber?: string;
    street?: string;
    barangayName?: string;
    cityMunicipalityName?: string;
    provinceName?: string;
  };
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

//-----------------------------------------------------------
// CREATE REGISTRATION PAYLOAD
//-----------------------------------------------------------

export function createRegistrationPayload({
  personalInfo,
  addressDetails,
  photoUrl,
  plan,
  payment,
  paymentStatus = "pending",
}: CreateRegistrationPayloadParams): RegisterMemberPayload {
  return {
    p_first_name: toTitleCase(personalInfo.firstName ?? ""),
    p_middle_name: toTitleCase(personalInfo.middleName ?? ""),
    p_last_name: toTitleCase(personalInfo.lastName ?? ""),
    p_suffix: personalInfo.suffix ?? "",
    p_email: personalInfo.emailAddress ?? "",
    p_contact_number: personalInfo.contactNumber ?? "",

    p_house_number: addressDetails.houseNumber ?? "",
    p_street: addressDetails.street ?? "",
    p_barangay: addressDetails.barangayName ?? "",
    p_city_municipality: addressDetails.cityMunicipalityName ?? "",
    p_province: addressDetails.provinceName ?? "",

    p_photo_url: photoUrl,

    p_service_id: plan.service_id,
    p_plan_id: plan.plan_id,
    p_amount: plan.price,

    p_payment_method: payment.method,
    p_reference_number: payment.referenceNumber,

    p_payment_status: paymentStatus
  };
}