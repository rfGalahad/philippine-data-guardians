import type { PaymentMethod, PaymentStatus } from "@/lib/supabase/types";
import { updateMember } from "@/lib/supabase/members";
import { getPlan } from "@/lib/supabase/plan";

import type { RegistrationValues } from "../schema";
import { createUpdateMemberPayload } from "../utils/payload";

function assertUpdateableMember(
  values: RegistrationValues
): asserts values is RegistrationValues & { subscriberId: string; memberId: string } {
  if (!values.subscriberId || !values.memberId) {
    throw new Error("subscriberId and memberId are required to update a member");
  }
}

export async function updateMemberDetails(
  values: RegistrationValues,
  plan: string,
  photoUrl: string,
  payment: {
    method: PaymentMethod,
    referenceNumber?: string 
  },
  paymentStatus: PaymentStatus
) {

  const planDetails = await getPlan(plan);

  assertUpdateableMember(values);

  const payload = createUpdateMemberPayload({
    values,
    photoUrl,
    plan: planDetails,
    payment: { 
      method: payment.method, 
      referenceNumber: payment.referenceNumber ?? "pending" 
    },
    paymentStatus,
  });

  return updateMember(payload);
}