import { removeMemberPhoto, uploadMemberPhoto } from "@/lib/supabase/member-photos";
import type { RegistrationValues } from "../schema";
import { registerNewMember } from "./registerNewMember";
import { ActiveMembershipError, checkEmailMembership } from "@/lib/supabase/members";

 
export async function registerMemberWithPhoto(
  values: RegistrationValues, 
  plan: string,
  opts: { confirmRenewal?: boolean } = {}
) {

  // UPLOAD MEMBER PHOTO TO SUPABASE STORAGE
  if (!(values.uploadPicture instanceof File)) {
    throw new Error("Please upload a valid photo file.");
  }

  // PROMPT RENEWAL IF EMAIL EXISTS AND ACTIVE
  if (!opts.confirmRenewal) {
    const status = await checkEmailMembership(values.emailAddress);
    if (status.exists && status.is_active) {
      throw new ActiveMembershipError(status.expires_at ?? null);
    }
  }

  // UPLOAD PHOTO TO SUPABASE
  const photoPath = await uploadMemberPhoto(values.uploadPicture);

  try {
    const paymentMethod = values.method ?? "paymongo";
    const paymentStatus = paymentMethod === "paymongo"
      ? "pending"
      : "paid"; 

    return { 
      result: await registerNewMember(
        values, 
        plan, 
        photoPath,
        {
          method: paymentMethod,
          referenceNumber: values.referenceNumber ?? "pending"
        },
        paymentStatus,
        opts
      ),  
      photoPath 
    };
  } catch (error) {
    await removeMemberPhoto(photoPath);
    throw error;
  }
}  