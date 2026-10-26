import { withSupabase } from "npm:@supabase/server";
import { json, preflight } from "../_shared/cors.ts";
import { getPaymentByReference } from "../_shared/payments.ts";

// --------------------------------------------------------------------------------------------//
// HELPERS
// --------------------------------------------------------------------------------------------//

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function maskEmail(email: string): string {
  const [name, domain] = email.split("@");
  if (!name || !domain) return "your email";
  return `${name[0]}${"*".repeat(Math.max(name.length - 1, 2))}@${domain}`;
}

// --------------------------------------------------------------------------------------------//
// HANDLER
// --------------------------------------------------------------------------------------------//

const handler = (outerReq: Request) =>
  withSupabase({ auth: ["publishable"] }, async (req) => {
    if (req.method !== "POST") return json(outerReq, { error: "Method not allowed" }, 405);

    let reference: unknown;
    try {
      ({ reference } = await req.json());
    } catch {
      return json(outerReq, { paid: false, error: "Malformed request" }, 400);
    }

    if (typeof reference !== "string" || !UUID_RE.test(reference)) {
      return json(outerReq, { paid: false, error: "Invalid reference" }, 400);
    }

    try {
      const payment = await getPaymentByReference(reference);

      // Same response for "not found" and "pending"
      if (!payment || payment.payment_status !== "paid") {
        return json(outerReq, { paid: false });
      }

      const sub = payment.subscriptions;
      const email = sub?.subscribers?.email;

      return json(outerReq, {
        paid: true,
        email: email ? maskEmail(email) : null,
        serviceName: sub?.services?.service_name ?? null,
      });
    } catch (e) {
      console.error("[verify-checkout]", e);
      return json(outerReq, { paid: false, error: "Internal error" }, 500);
    }
  })(outerReq);

// --------------------------------------------------------------------------------------------//
// MAIN FUNCTION
// --------------------------------------------------------------------------------------------//

export default {
  fetch: (req: Request) => {
    if (req.method === "OPTIONS") return preflight(req);
    return handler(req);
  },
};