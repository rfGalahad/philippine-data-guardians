//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const PAYMONGO_WEBHOOK_SECRET = Deno.env.get("PAYMONGO_WEBHOOK_SECRET")!;
const TIMESTAMP_TOLERANCE_SECS = 300;

//-----------------------------------------------------------
// HELPERS
//-----------------------------------------------------------

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

//-----------------------------------------------------------
// MAIN FUNCTION
//-----------------------------------------------------------

export default async function verifySignature (
  req: Request, 
  rawBody: string
): Promise<boolean> {
  
  const sigHeader = req.headers.get("Paymongo-Signature");
  if (!sigHeader) return false;

  const parts: Record<string, string> = {};
  for (const part of sigHeader.split(",")) {
    const idx = part.indexOf("=");
    if (idx !== -1) parts[part.slice(0, idx)] = part.slice(idx + 1);
  }

  const { t: timestamp, li, te } = parts;
  const signature = li || te;

  if (!timestamp || !signature) return false;

  const age = Math.abs(Date.now() / 1000 - parseInt(timestamp, 10));
  if (age > TIMESTAMP_TOLERANCE_SECS) {
    log("warn", "webhook_timestamp_expired", { age });
    return false;
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(PAYMONGO_WEBHOOK_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${timestamp}.${rawBody}`),
  );

  const expected = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return safeEqual(expected, signature);
}