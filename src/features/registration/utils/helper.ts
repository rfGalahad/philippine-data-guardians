import { getMemberPhotoUrl, uploadMemberPhoto } from "@/lib/supabase/member-photos";

export const getPhotoUrl = async (
  uploadPicture: File | string
): Promise<{ photoUrl: string; photoPath: string | null }> => {

  if (typeof uploadPicture === "string") {
    return {
      photoUrl: uploadPicture,
      photoPath: null,
    };
  }

  const photoPath = await uploadMemberPhoto(uploadPicture);

  return {
    photoUrl: getMemberPhotoUrl(photoPath),
    photoPath,
  };
};

export const getPlanName = (tier: string) => {
  switch (tier) {
    case "Student/Academe":
      return "student_academic";

    default:
      return "professional";
  }
};