import type { MemberDetail } from "@/lib/supabase/members";
import type { RegistrationValues } from "../schema";
import { normalizePhilippinePhoneNumber } from "@/utils/string";
import { resolveBarangayId, resolveMunicipalityId, resolveProvinceId } from "@/lib/addressData";


export function mapMemberDetailToFormValues(
  member: MemberDetail
): RegistrationValues { 

  const currentSubscription = member.subscriptions[0] ?? null;

  const provinceId = resolveProvinceId(member.address?.province);
  const cityMunicipalityId = resolveMunicipalityId(
    member.address?.cityMunicipality,
    provinceId
  );
  const barangayId = resolveBarangayId(member.address?.barangay, cityMunicipalityId);

  return {
    subscriberId: member.subscriberId,
    memberId: member.memberId,

    firstName: member.firstName,
    middleName: member.middleName ?? "",
    lastName: member.lastName,
    suffix: member.suffix ?? "",
    emailAddress: member.email,
    contactNumber: normalizePhilippinePhoneNumber(member.contactNumber) ?? "",

    oldPhotoUrl: member.photoUrl ?? "",
    uploadPicture: member.photoUrl ?? null,

    province: provinceId ?? "",
    cityMunicipality: cityMunicipalityId ?? "",
    barangay: barangayId ?? "",
    street: member.address?.street ?? "",
    houseNumber: member.address?.houseNumber ?? "",

    plan: currentSubscription?.planName ?? null,
    cost: currentSubscription?.price ?? 0,
    
    method: currentSubscription?.paymentMethod ?? null,
    referenceNumber: currentSubscription?.referenceNumber ?? "",
  };
}