//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface NameData {
  firstName?: string;
  middleName?: string | null;
  lastName?: string;
  suffix?: string | null;
}

//-----------------------------------------------------------
// HELPERS
//-----------------------------------------------------------

export const getFullName = (data: NameData): string =>
  [
    data.firstName,
    data.middleName,
    data.lastName,
    data.suffix,
  ]
    .filter(Boolean)
    .join(" ");


export const toTitleCase = (s: string): string =>
  s.toLowerCase().replace(/(^|[\s\-'])(\p{L})/gu, (_, sep, ch) => sep + ch.toUpperCase());


export const maskEmail = (email: string): string => {
  return email.replace(/(.{2}).+(@.+)/, "$1***$2");
}