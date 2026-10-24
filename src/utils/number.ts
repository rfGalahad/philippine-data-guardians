export function formatCurrency(n: number | null) {
  if (n === null || n === undefined) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "PHP", maximumFractionDigits: 0 });
}

export const toNumber = (value: number | string | null | undefined): number =>
  value == null ? 0 : Number(value);