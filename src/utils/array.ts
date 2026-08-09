import { toTitleCase } from "./string";

export function optionsFrom(values: (string | null)[]) {
  const unique = Array.from(new Set(values.filter((v): v is string => !!v)));
  return unique.sort((a, b) => a.localeCompare(b)).map((v) => ({ value: v, label: toTitleCase(v) }));
}