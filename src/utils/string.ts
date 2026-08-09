//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface NameData {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  suffix?: string;
}

interface AddressDetails {
  houseNumber?: string;
  street?: string;
  barangayName?: string;
  cityMunicipalityName?: string;
  provinceName?: string;
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
    address.barangayName,
    address.cityMunicipalityName,
    address.provinceName,
  ]
    .filter(Boolean)
    .join(", ");