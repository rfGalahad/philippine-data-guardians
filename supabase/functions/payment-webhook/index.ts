import { withSupabase } from "npm:@supabase/server@^1";
import { handleMembershipPayment } from "./handlers/handleMembershipPayment.ts";
import { handleSubscriptionPayment } from "./handlers/handleSubscriptionPayment.ts";

import verifySignature from "./utils/verifySignature.ts";

// --------------------------------------------------------------------------------------------//
// CONSTANTS
// --------------------------------------------------------------------------------------------//

const WEBHOOK_EVENT = "checkout_session.payment.paid";

// --------------------------------------------------------------------------------------------//
// FUNCTION
// --------------------------------------------------------------------------------------------//

export default {
  fetch: withSupabase({ auth: "none" }, async (req) => {
    try {
      const rawBody = await req.text();

      const isValid = await verifySignature(req, rawBody);
      if (!isValid) {
        console.warn("[webhook] invalid_signature");
        return Response.json({ error: "Invalid signature" }, { status: 401 });
      }

      const body = JSON.parse(rawBody);
      const eventType = body?.data?.attributes?.type;

      if (eventType !== WEBHOOK_EVENT) {
        console.log("[webhook] webhook_ignored", { eventType });
        return Response.json({ received: true }, { status: 200 });
      }

      const attributes = body?.data?.attributes?.data?.attributes;
      const name = attributes?.billing?.name;
      const email: string | undefined = attributes?.billing?.email;
      const planName: string | undefined = attributes?.description;
      const referenceNumber: string | undefined = attributes?.reference_number;

      if (!email || !planName || !referenceNumber) {
        console.error("[webhook] missing_payload_fields", {
          hasEmail: !!email,
          hasPlan: !!planName,
          hasReference: !!referenceNumber,
        });
        return Response.json({ error: "Invalid payload" }, { status: 400 });
      }

      // EDGE FUNCTION for HANDLING MEMBERSHIP PAYMENT
      if (planName.includes("PDG Membership")) {
        return handleMembershipPayment({ name, email, planName, referenceNumber });
      }

      //  EDGE FUNCTION for HANDLING SUBSCRIPTION PAYMEN
      return handleSubscriptionPayment({ email, planName });

    } catch (err) {
      console.error("[webhook] unhandled_exception", { message: err.message, stack: err.stack });
      return Response.json({ error: "Internal server error" }, { status: 500 });
    }
  }),
};