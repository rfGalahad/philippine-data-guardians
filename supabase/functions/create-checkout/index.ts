import { withSupabase } from "@supabase/server";

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------
 
const PAYMONGO_SECRET_KEY = Deno.env.get("PAYMONGO_SECRET_KEY")!;
const PAYMONGO_API_URL = "https://api.paymongo.com/v1/checkout_sessions";

//-----------------------------------------------------------
// CORS HEADER
//-----------------------------------------------------------

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

//-----------------------------------------------------------
// HANDLER
//-----------------------------------------------------------

const handler = withSupabase({ auth: ["publishable"] }, async (req, ctx) => {
  try {
    const { 
      subscriberId,
      subscriptionId,
      email, 
      customerName,
      description
    } = await req.json();

    if (!subscriberId || !subscriptionId) {
      return Response.json(
        { error: "Missing subscriberId or subscriptionId in request body" },
        { status: 400, headers: corsHeaders }
      );
    }
 
    const { data: payment, error: paymentError } = await ctx.supabaseAdmin
      .from("payments")
      .select("amount")
      .eq("subscription_id", subscriptionId)
      .eq("payment_status", "pending")
      .single();

    if (paymentError || !payment) {
      return Response.json(
        { error: "No pending payment record found" },
        { status: 404, headers: corsHeaders }
      );
    }

    const amount = Math.round(Number(payment.amount) * 100); // centavos
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
            billing: { 
              email, 
              name: customerName
            },
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            description,
            reference_number: referenceNumber,
            line_items: [{ 
              currency: "PHP", 
              amount, 
              name: description, 
              quantity: 1 
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

    // UPDATE the pending row created during registration
    const { data: updated, error: updateError } = await ctx.supabaseAdmin
      .from("payments")
      .update({ reference_number: referenceNumber })
      .eq("subscription_id", subscriptionId)
      .eq("payment_status", "pending")
      .select();
 
    if (updateError) {
      console.error("Update error:", updateError);
      return Response.json(
        { error: updateError.message, code: updateError.code },
        { status: 500, headers: corsHeaders }
      );
    }

    if (!updated || updated.length === 0) {
      console.error("No pending payment row found", { subscriberId, subscriptionId });
      return Response.json(
        { error: "No pending payment record found for this subscriber/subscription" },
        { status: 404, headers: corsHeaders }
      );
    }

    // RETURN CHECKOUT_URL
    return Response.json(
      { url: data.data.attributes.checkout_url }, 
      { headers: corsHeaders }
    );
  } catch (err) {
    return Response.json(
      { error: err.message }, 
      { status: 500, headers: corsHeaders }
    );
  }
});

//-----------------------------------------------------------
// MAIN FUNCTION
//-----------------------------------------------------------

export default {
  fetch: (req: Request) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

    return handler(req);
  },
};