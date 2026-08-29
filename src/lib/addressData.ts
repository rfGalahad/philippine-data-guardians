import provinceData from '@/data/province.json';
import municipalityData from '@/data/municipality.json';
import barangayData from '@/data/barangay.json';


//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

export interface Province {
  province_id: number;
  region_id: number;
  province_name: string;
}

export interface Municipality {
  municipality_id: number;
  province_id: number;
  municipality_name: string;
}

export interface Barangay {
  barangay_id: number;
  municipality_id: number;
  barangay_name: string;
}

export interface AddressOption {
  label: string;
  value: string;
}

//-----------------------------------------------------------
// NORMALIZATION
//-----------------------------------------------------------
// Handles: case/whitespace differences, stripped/curly diacritics,
// and mojibake like "Santo NiÃ±o" (UTF-8 bytes for "ñ" that got
// decoded as Latin-1 somewhere upstream).

// Attempt to repair UTF-8-decoded-as-Latin-1 mojibake.
// "NiÃ±o" -> re-encode as Latin-1 bytes -> decode as UTF-8 -> "Niño"
const repairMojibake = (str: string): string => {
  // Heuristic: mojibake shows up as Ã followed by another high-bit char.
  if (!/Ã./.test(str)) return str;
  try {
    const bytes = Uint8Array.from([...str].map((ch) => ch.charCodeAt(0)));
    const repaired = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return repaired;
  } catch {
    return str; // not valid UTF-8 bytes after all — leave as-is
  }
};

export const normalizeName = (str: string): string =>
  repairMojibake(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics (ñ -> n, á -> a, etc)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
    
//-----------------------------------------------------------
// HELPERS
//-----------------------------------------------------------

const toOption = (value: number, label: string): AddressOption => ({
  label,
  value: String(value),
});

// Computed once at module load — not per-render, not per-hook-instance.
export const PROVINCE_OPTIONS: AddressOption[] = (provinceData as Province[])
  .map((p) => toOption(p.province_id, p.province_name))
  .sort((a, b) => a.label.localeCompare(b.label));

// Pre-group municipalities/barangays by parent id for O(1) lookup
// instead of filtering the full array on every selection change.
const municipalitiesByProvince = new Map<string, AddressOption[]>();
for (const m of municipalityData as Municipality[]) {
  const key = String(m.province_id);
  const list = municipalitiesByProvince.get(key) ?? [];
  list.push(toOption(m.municipality_id, m.municipality_name));
  municipalitiesByProvince.set(key, list);
}
municipalitiesByProvince.forEach((list) =>
  list.sort((a, b) => a.label.localeCompare(b.label))
);

const barangaysByMunicipality = new Map<string, AddressOption[]>();
for (const b of barangayData as Barangay[]) {
  const key = String(b.municipality_id);
  const list = barangaysByMunicipality.get(key) ?? [];
  list.push(toOption(b.barangay_id, b.barangay_name));
  barangaysByMunicipality.set(key, list);
}
barangaysByMunicipality.forEach((list) =>
  list.sort((a, b) => a.label.localeCompare(b.label))
);

export const getMunicipalityOptions = (provinceId?: string | null): AddressOption[] =>
  provinceId ? municipalitiesByProvince.get(provinceId) ?? [] : [];

export const getBarangayOptions = (municipalityId?: string | null): AddressOption[] =>
  municipalityId ? barangaysByMunicipality.get(municipalityId) ?? [] : [];

//-----------------------------------------------------------
// ID -> NAME LOOKUPS
//-----------------------------------------------------------
// The inverse of the by-parent grouping above: keyed by the record's
// own id, for turning a stored form value (an id string) back into a
// display name — e.g. on the Review step.

const provinceNameById = new Map<string, string>(
  (provinceData as Province[]).map((p) => [String(p.province_id), p.province_name])
);

const municipalityNameById = new Map<string, string>(
  (municipalityData as Municipality[]).map((m) => [
    String(m.municipality_id),
    m.municipality_name,
  ])
);

const barangayNameById = new Map<string, string>(
  (barangayData as Barangay[]).map((b) => [String(b.barangay_id), b.barangay_name])
);

export const getProvinceName = (provinceId?: string | number | null): string | undefined =>
  provinceId != null ? provinceNameById.get(String(provinceId)) : undefined;

export const getMunicipalityName = (
  municipalityId?: string | number | null
): string | undefined =>
  municipalityId != null ? municipalityNameById.get(String(municipalityId)) : undefined;

export const getBarangayName = (barangayId?: string | number | null): string | undefined =>
  barangayId != null ? barangayNameById.get(String(barangayId)) : undefined;

//-----------------------------------------------------------
// NAME -> ID LOOKUPS
//-----------------------------------------------------------
// The inverse of the ID -> NAME maps above: turning a display name
// back into its id — e.g. matching a freeform/legacy value to an id
// on form load. Municipality and barangay names can repeat across
// different parents, so these are scoped by parent id when provided.

const provinceIdByName = new Map<string, string>(
  (provinceData as Province[]).map((p) => [normalizeName(p.province_name), String(p.province_id)])
);

const municipalityIdByProvinceAndName = new Map<string, string>(
  (municipalityData as Municipality[]).map((m) => [
    `${m.province_id}:${normalizeName(m.municipality_name)}`,
    String(m.municipality_id),
  ])
);

const municipalityIdByNameGlobal = new Map<string, string>(
  (municipalityData as Municipality[]).map((m) => [
    normalizeName(m.municipality_name),
    String(m.municipality_id),
  ])
);

const barangayIdByMunicipalityAndName = new Map<string, string>(
  (barangayData as Barangay[]).map((b) => [
    `${b.municipality_id}:${normalizeName(b.barangay_name)}`,
    String(b.barangay_id),
  ])
);

const barangayIdByNameGlobal = new Map<string, string>(
  (barangayData as Barangay[]).map((b) => [
    normalizeName(b.barangay_name),
    String(b.barangay_id),
  ])
);

export const getProvinceId = (provinceName?: string | null): string | undefined =>
  provinceName ? provinceIdByName.get(normalizeName(provinceName)) : undefined;

export const getMunicipalityId = (
  municipalityName?: string | null,
  provinceId?: string | number | null
): string | undefined => {
  if (!municipalityName) return undefined;
  const normalized = normalizeName(municipalityName);
  if (provinceId != null) {
    return municipalityIdByProvinceAndName.get(`${provinceId}:${normalized}`);
  }
  return municipalityIdByNameGlobal.get(normalized);
};

export const getBarangayId = (
  barangayName?: string | null,
  municipalityId?: string | number | null
): string | undefined => {
  if (!barangayName) return undefined;
  const normalized = normalizeName(barangayName);
  if (municipalityId != null) {
    return barangayIdByMunicipalityAndName.get(`${municipalityId}:${normalized}`);
  }
  return barangayIdByNameGlobal.get(normalized);
};

//-----------------------------------------------------------
// RESOLVE (ID OR NAME) -> ID
//-----------------------------------------------------------
// Input may already be an id, or it may be a display name (e.g. from
// legacy data, CSV import, or manual entry). These normalize either
// case down to a canonical id string. Resolution cascades top-down
// since municipality/barangay lookups need their resolved parent id.

const isBlank = (v?: string | null): v is undefined | null | "" =>
  v == null || v === "";

export const resolveProvinceId = (province?: string | null): string | undefined => {
  if (isBlank(province)) return undefined;
  if (provinceNameById.has(province)) return province; // already an id
  return getProvinceId(province); // treat as name
};

export const resolveMunicipalityId = (
  municipality?: string | null,
  provinceId?: string | null
): string | undefined => {
  if (isBlank(municipality)) return undefined;
  if (municipalityNameById.has(municipality)) return municipality; // already an id
  return getMunicipalityId(municipality, provinceId); // treat as name
};

export const resolveBarangayId = (
  barangay?: string | null,
  municipalityId?: string | null
): string | undefined => {
  if (isBlank(barangay)) return undefined;
  if (barangayNameById.has(barangay)) return barangay; // already an id
  return getBarangayId(barangay, municipalityId); // treat as name
};

