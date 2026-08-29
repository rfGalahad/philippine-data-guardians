import { removeMemberPhoto } from "@/lib/supabase/member-photos";
import type { RegistrationValues } from "../schema";
import { createMemberCheckoutUrl } from "./createMemberCheckoutUrl";
import { registerMemberWithPhoto } from "./registerMemberWithPhoto";
import { removeMember } from "@/lib/supabase/members";


export async function registerAndCheckout(
  values: RegistrationValues, 
  plan: string
) {
  const { result, photoPath } = await registerMemberWithPhoto(values, plan);
  try {
    return await createMemberCheckoutUrl(values, plan, result);
  } catch (error) {
    await removeMemberPhoto(photoPath);
    await removeMember([result.subscriber_id]);
    throw error;
  }
}