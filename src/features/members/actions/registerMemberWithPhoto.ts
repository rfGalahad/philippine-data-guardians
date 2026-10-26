import { getMemberPhotoUrl, removeMemberPhoto, uploadMemberPhoto } from "@/lib/supabase/member-photos";
import type { RegistrationValues } from "../schema";
import { ActiveMembershipError, checkEmailMembership, registerMemberAsAdmin } from "@/lib/supabase/members";
import { getPlan } from "@/lib/supabase/plan";
import { createMemberPayload } from "../utils/payload";

 

export async function registerMemberWithPhoto(
  values: RegistrationValues,
  planId: string,
  opts: { confirmRenewal?: boolean } = {}
) {

  if (!(values.uploadPicture instanceof File)) {
    throw new Error("Please upload a valid photo file.");
  }

  if (!opts.confirmRenewal) {
    const status = await checkEmailMembership(values.emailAddress);
    if (status.exists && status.is_active) {
      throw new ActiveMembershipError(status.expires_at ?? null);
    }
  }

  // Fetch the plan BEFORE uploading, so a bad plan doesn't leave an orphan photo
  const plan = await getPlan(planId);

  const photoPath = await uploadMemberPhoto(values.uploadPicture);
  try {
    const method = values.method ?? "paymongo";
    const payload = createMemberPayload({
      values,
      photoUrl: getMemberPhotoUrl(photoPath),
      plan,
      payment: { method, referenceNumber: values.referenceNumber ?? "pending" },
      paymentStatus: method === "paymongo" ? "pending" : "paid",
    });

    return { 
      result: await registerMemberAsAdmin(payload), 
      photoPath 
    };
  } catch (error) {
    await removeMemberPhoto(photoPath);
    throw error;
  }
}