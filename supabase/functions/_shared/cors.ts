// --------------------------------------------------------------------------------------------//
// CORS HEADER
// --------------------------------------------------------------------------------------------//

const allowedOrigins = (Deno.env.get("APP_ORIGINS") ?? "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const VERCEL_RE = /^https:\/\/philippine-data-guardians(-[a-z0-9-]+)?\.vercel\.app$/;

function isAllowedOrigin(origin: string): boolean {
  return allowedOrigins.includes(origin) || VERCEL_RE.test(origin);
}

export function getSafeOrigin(req: Request): string | null {
  const origin = req.headers.get("Origin") ?? "";
  return isAllowedOrigin(origin) ? origin : null;
}

export function getCorsHeaders(req: Request) {
  return {
    "Access-Control-Allow-Origin": getSafeOrigin(req) ?? allowedOrigins[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

// --------------------------------------------------------------------------------------------//
// JSON HELPER
// --------------------------------------------------------------------------------------------//

export const json = (req: Request, body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
  });

export const preflight = (req: Request) =>
  new Response("ok", { headers: getCorsHeaders(req) });