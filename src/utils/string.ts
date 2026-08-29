import {
  getBarangayName,
  getMunicipalityName,
  getProvinceName,
} from "@/lib/addressData";

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface NameData {
  firstName?: string;
  middleName?: string | null;
  lastName?: string;
  suffix?: string | null;
}

interface AddressDetails {
  houseNumber?: string;
  street?: string;
  barangay?: string;
  cityMunicipality?: string;
  province?: string;
}

//-----------------------------------------------------------
// HELPERS
//-----------------------------------------------------------

//
export const toTitleCase = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const getInitials = (name?: string | null): string => {
  if (!name?.trim()) return "?";

  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export const getFullName = (data: NameData): string =>
  [
    data.firstName,
    data.middleName,
    data.lastName,
    data.suffix,
  ]
    .filter(Boolean)
    .join(" ");

    
export const getFullAddress = (address: AddressDetails): string =>
  [
    address.houseNumber,
    address.street,
    getBarangayName(address.barangay),
    getMunicipalityName(address.cityMunicipality),
    getProvinceName(address.province),
  ]
    .filter(Boolean)
    .join(", ");

export const stringOrEmpty = (value: string | null | undefined): string =>
  value ?? '';

export function normalizePhilippinePhoneNumber(
  value: string | null | undefined
): string {
  if (!value) return "";

  const phone = value.trim();

  // 09123456789
  if (phone.startsWith("09")) {
    return phone;
  }

  // 9123456789
  if (phone.startsWith("9")) {
    return `0${phone}`;
  }

  // +639123456789
  if (phone.startsWith("+63")) {
    return `0${phone.slice(3)}`;
  }

  // 639123456789
  if (phone.startsWith("63")) {
    return `0${phone.slice(2)}`;
  }

  return phone;
}