export function formatCurrency(n: number | null) {
  if (n === null || n === undefined) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "PHP", maximumFractionDigits: 0 });
}