import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import { CONFIG } from "./config.ts";
import { handleMembershipPayment } from "./handlers/membership-handler.ts";
import { handleSubscriptionPayment } from "./handlers/subscription-handler.ts";

import verifySignature from "./utils/verify-signature.ts";


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

      if (eventType !== CONFIG.webhookEvent) {
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

      if (planName.includes("PDG Membership")) {
        return handleMembershipPayment({ name, email, planName, referenceNumber });
      }

      return handleSubscriptionPayment({ email, planName });
    } catch (err) {
      console.error("[webhook] unhandled_exception", { message: err.message, stack: err.stack });
      return Response.json({ error: "Internal server error" }, { status: 500 });
    }
  }),
};