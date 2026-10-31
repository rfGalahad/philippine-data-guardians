export interface AddressRow {
  house_number: string | null;
  street: string | null;
  barangay: string | null;
  city_municipality: string | null;
  province: string | null;
}

export interface AddressParts {
  houseNumber?: string | null;
  street?: string | null;
  barangay?: string | null;
  cityMunicipality?: string | null;
  province?: string | null;
}

export function buildFullAddress(address?: AddressParts | null): string {
  if (!address) return "-";

  const parts = [
    address.houseNumber,
    address.street,
    address.barangay,
    address.cityMunicipality,
    address.province,
  ]
    .map((p) => p?.trim())
    .filter((p): p is string => !!p);

  return parts.length ? parts.join(", ") : "-";
}