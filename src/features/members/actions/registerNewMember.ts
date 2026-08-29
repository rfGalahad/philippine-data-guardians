import { getMemberPhotoUrl } from "@/lib/supabase/member-photos";
import { registerMember } from "@/lib/supabase/members";
import { getPlan } from "@/lib/supabase/plan";

import type { RegistrationValues } from "../schema";
import { createMemberPayload } from "../utils/payload";
import type { PaymentMethod, PaymentStatus } from "@/lib/supabase/types";


export async function registerNewMember(
  values: RegistrationValues,
  plan: string,
  photoPath: string,
  payment: {
    method: PaymentMethod,
    referenceNumber?: string 
  },
  paymentStatus: PaymentStatus
) {
  const photoUrl = getMemberPhotoUrl(photoPath);
  const planDetails = await getPlan(plan);

  const payload = createMemberPayload({
    values,
    photoUrl,
    plan: planDetails,
    payment: { 
      method: payment.method, 
      referenceNumber: payment.referenceNumber ?? "pending" 
    },
    paymentStatus,
  });

  return registerMember(payload);
}