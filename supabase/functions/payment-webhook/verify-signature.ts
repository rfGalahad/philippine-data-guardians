import { CONFIG } from "./config.ts";
import { safeEqual } from "./utils/helper.ts";

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const PAYMONGO_WEBHOOK_SECRET = Deno.env.get("PAYMONGO_WEBHOOK_SECRET")!;

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

  // Replay attack protection — reject stale webhooks
  const age = Math.abs(Date.now() / 1000 - parseInt(timestamp, 10));
  if (age > CONFIG.timestampToleranceSecs) {
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