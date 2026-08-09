export function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString(
    "en-US", 
    { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    }
  );
}