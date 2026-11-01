import provinceData from "./data/province.json" with { type: "json" };
import municipalityData from "./data/municipality.json" with { type: "json" };
import barangayData from "./data/barangay.json" with { type: "json" };

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

// ID -> NAME LOOKUPS
const provinceNameById = new Map<string, string>(
  provinceData.map((p) => [String(p.province_id), p.province_name]),
);
const municipalityNameById = new Map<string, string>(
  municipalityData.map((m) => [String(m.municipality_id), m.municipality_name]),
);
const barangayNameById = new Map<string, string>(
  barangayData.map((b) => [String(b.barangay_id), b.barangay_name]),
);

// Fixes "NiÃ±o" -> "Niño" (same idea as your client's repairMojibake)
function repairMojibake(str: string): string {
  if (!/Ã./.test(str)) return str;
  try {
    const bytes = Uint8Array.from([...str].map((ch) => ch.charCodeAt(0)));
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return str;
  }
}

// Stored value may be an id ("1234") or already a name (legacy data)
function toName(map: Map<string, string>, value?: string | null): string | undefined {
  const v = value?.trim();
  if (!v) return undefined;
  return repairMojibake(map.get(v) ?? v);
}

export function buildFullAddress(address?: AddressParts | null): string {
  if (!address) return "-";

  const parts = [
    address.houseNumber?.trim(),
    address.street?.trim(),
    toName(barangayNameById, address.barangay),
    toName(municipalityNameById, address.cityMunicipality),
    toName(provinceNameById, address.province),
  ].filter((p): p is string => !!p);

  return parts.length ? parts.join(", ") : "-";
}