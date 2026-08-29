import { removeMemberPhoto, uploadMemberPhoto } from "@/lib/supabase/member-photos";
import type { RegistrationValues } from "../schema";
import { registerNewMember } from "./registerNewMember";


export async function registerMemberWithPhoto(
  values: RegistrationValues, 
  plan: string
) {

  // UPLOAD MEMBER PHOTO TO SUPABASE STORAGE
  if (!(values.uploadPicture instanceof File)) {
    throw new Error("Please upload a valid photo file.");
  }
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
        paymentStatus
      ),  
      photoPath 
    };
  } catch (error) {
    await removeMemberPhoto(photoPath);
    throw error;
  }
} 