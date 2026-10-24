import { withSupabase } from "@supabase/server";
import { corsHeaders } from "../_shared/cors.ts";
import {
  getPendingPaymentAmount,
  setPaymentReference,
} from "../_shared/payments.ts";

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const PAYMONGO_SECRET_KEY = Deno.env.get("PAYMONGO_SECRET_KEY")!;
const PAYMONGO_API_URL = "https://api.paymongo.com/v1/checkout_sessions";

//-----------------------------------------------------------
// HANDLER
//-----------------------------------------------------------

const handler = withSupabase({ auth: ["publishable"] }, async (req) => {
  
  try {
    const {
      subscriberId,
      subscriptionId,
      email,
      customerName,
      description,
    } = await req.json();

    if (!subscriberId || !subscriptionId) {
      return Response.json(
        { error: "Missing subscriberId or subscriptionId in request body" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Look up the pending payment amount (shared helper)
    let pendingAmount: number;
    try {
      pendingAmount = await getPendingPaymentAmount(subscriptionId);
    } catch (e) {
      console.error("Pending payment lookup failed:", e);
      return Response.json(
        { error: "No pending payment record found" },
        { status: 404, headers: corsHeaders }
      );
    }

    const amount = Math.round(pendingAmount * 100); // centavos
    const appOrigin = Deno.env.get("APP_ORIGIN")!;
    const cancelUrl = `${appOrigin}/cancelled/membership`;

    const referenceNumber = crypto.randomUUID();
    const successUrl = `${appOrigin}/success/membership?ref=${referenceNumber}`;
    const encoded = btoa(PAYMONGO_SECRET_KEY + ":");

    const response = await fetch(PAYMONGO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${encoded}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            billing: { email, name: customerName },
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            description,
            reference_number: referenceNumber,
            line_items: [{
              currency: "PHP",
              amount,
              name: description,
              quantity: 1,
            }],
            payment_method_types: ["card", "gcash", "grab_pay"],
            success_url: successUrl,
            cancel_url: cancelUrl,
          },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: data },
        { status: response.status, headers: corsHeaders }
      );
    }

    // Attach the reference to the pending row created during registration
    try {
      await setPaymentReference(subscriptionId, referenceNumber);
    } catch (e) {
      console.error("Failed to set payment reference:", e, {
        subscriberId,
        subscriptionId,
      });
      const message = e instanceof Error ? e.message : "Failed to update payment";
      const notFound = message.includes("No pending payment record");
      return Response.json(
        { error: message },
        { status: notFound ? 404 : 500, headers: corsHeaders }
      );
    }

    // RETURN CHECKOUT_URL
    return Response.json(
      { url: data.data.attributes.checkout_url },
      { headers: corsHeaders }
    );
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Unexpected error" },
      { status: 500, headers: corsHeaders }
    );
  }
});

//-----------------------------------------------------------
// MAIN FUNCTION
//-----------------------------------------------------------

export default {
  fetch: (req: Request) => {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    return handler(req);
  },
};