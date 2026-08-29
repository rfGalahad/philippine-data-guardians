import { getMemberPhotoPath, getMemberPhotoUrl, removeMemberPhoto, uploadMemberPhoto } from "@/lib/supabase/member-photos";
import type { RegistrationValues } from "../schema";
import { updateMemberDetails } from "./updateMemberDetails";


export async function updateMemberWithPhoto(
  values: RegistrationValues,
  plan: string
) {

  const isNewPhoto = values.uploadPicture instanceof File;
  const oldPhotoUrl = values.oldPhotoUrl;

  let photoUrl: string;
  let uploadedPhotoPath: string | null = null; 

  if (isNewPhoto) {
    uploadedPhotoPath = await uploadMemberPhoto(values.uploadPicture as File);
    photoUrl = getMemberPhotoUrl(uploadedPhotoPath);
  } else if (typeof values.uploadPicture === "string" && values.uploadPicture) {
    photoUrl = values.uploadPicture;
  } else {
    throw new Error("Please upload a valid photo file.");
  }

  try {
    const paymentMethod = values.method ?? "paymongo";
    const paymentStatus = paymentMethod === "paymongo" ? "pending" : "paid";

    const result = await updateMemberDetails(
      values,
      plan,
      photoUrl,
      {
        method: paymentMethod,
        referenceNumber: values.referenceNumber ?? "pending",
      },
      paymentStatus
    );

    // REMOVE OLD PHOTO
    if (isNewPhoto && oldPhotoUrl) {
      const oldPath = getMemberPhotoPath(oldPhotoUrl);
      if (oldPath && oldPath !== uploadedPhotoPath) {
        await removeMemberPhoto(oldPath);
      }
    }

    return result;
  } catch (error) {
    if (uploadedPhotoPath) await removeMemberPhoto(uploadedPhotoPath);
    throw error;
  }
}