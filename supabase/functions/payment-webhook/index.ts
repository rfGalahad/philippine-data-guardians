import "@supabase/functions-js/edge-runtime.d.ts"; 
import { withSupabase } from "@supabase/server"; 
import { createClient } from "@supabase/supabase-js"; 

import { CONFIG } from "./config.ts"; 
import { maskEmail } from "./utils.ts"; 

import verifySignature from "./verify-signature.ts"; 
import sendEmail from "./send-email.ts"; 

//----------------------------------------------------------- 
// CONSTANTS 
//----------------------------------------------------------- 

const supabaseAdmin = createClient( 
  Deno.env.get("SUPABASE_URL")!, 
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, 
); 

//----------------------------------------------------------- 
// MAIN FUNCTION 
//----------------------------------------------------------- 

export default {
  fetch: withSupabase({ auth: "none" }, async (req) => {
    try {
      const rawBody = await req.text();

      // VERIFY SIGNATURE
      const isValid = await verifySignature(req, rawBody);
      if (!isValid) {
        console.warn("[webhook] invalid_signature");
        return Response.json({ error: "Invalid signature" }, { status: 401 });
      }

      // PARSE & VALIDATE
      const body = JSON.parse(rawBody);
      const eventType = body?.data?.attributes?.type;

      if (eventType !== CONFIG.webhookEvent) {
        console.log("[webhook] webhook_ignored", { eventType });
        return Response.json({ received: true }, { status: 200 });
      }

      const attributes = body?.data?.attributes?.data?.attributes;
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
      
      // -------------------------------------------------------------------------------------
      // FOR PDG MEMBERSHIP REGISTRATION
      // -------------------------------------------------------------------------------------

      console.log("PLAN NAME", planName);
      
      if (planName.includes("PDG Membership")) {

        // UPDATE STATUS: PAID
        const { data: updated, error: updateError } = await supabaseAdmin
          .from("payments")
          .update({ payment_status: "paid", paid_at: new Date().toISOString() })
          .eq("reference_number", referenceNumber)
          .select();

        if (updateError) {
          console.error("[webhook] payment_update_failed", { message: updateError.message });
          return Response.json({ error: "Failed to update payment" }, { status: 500 });
        }

        if (!updated || updated.length === 0) {
          console.error("[webhook] payment_not_found", { referenceNumber });
          return Response.json({ error: "Payment record not found" }, { status: 404 });
        }

        const subscriberId = updated[0].subscriber_id;

        const { data: activatedMemberId, error: activationError } = await supabaseAdmin
          .rpc("activate_member", { p_subscriber_id: subscriberId });

        console.log("Activated Member:", activatedMemberId)

        if (activationError) {
          console.error("[webhook] member_activation_failed", {
            message: activationError.message,
            subscriberId,
          });
          // payment already succeeded — decide whether this should fail the whole webhook
          // or just get logged for manual follow-up. See note below.
        }

        // SUCCESS UPDATE STATUS TO PAID
        await sendEmail({ subscriptionType: "membership", email, planName });
        console.log("[webhook] membership_payment_confirmed", {
          email: maskEmail(email),
          plan: planName,
        });
        return Response.json(
          { success: true }, 
          { status: 200 }
        );
      }

      // -------------------------------------------------------------------------------------
      // FOR AUTOMATED PIA SYSTEM SUBSCRIPTION
      // -------------------------------------------------------------------------------------

      // CREATE USER
      const { error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
      });

      // EXISTING USER — SEND: SIGN-IN LINK
      if (createError?.code === "email_exists") {
        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
          type: "magiclink",
          email,
          options: { redirectTo: CONFIG.redirectUrls.existingUser },
        });
        if (linkError) throw linkError;

        await sendEmail({
          email,
          planName,
          actionLink: linkData.properties.action_link,
          isExisting: true,
        });

        console.log("[webhook] existing_user_signin_email_sent", {
          email: maskEmail(email),
          plan: planName,
        });
        return Response.json({ received: true }, { status: 200 });
      }

      if (createError) throw createError;

      // NEW USER — SEND: PASSWORD SETUP LINK
      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: "recovery",
        email,
        options: { redirectTo: CONFIG.redirectUrls.newUser },
      });
      if (linkError) throw linkError;

      await sendEmail({
        email,
        planName,
        actionLink: linkData.properties.action_link,
        isExisting: false,
      });

      console.log("[webhook] user_created_and_email_sent", {
        email: maskEmail(email),
        plan: planName,
      });
      
      return Response.json({ success: true }, { status: 200 });
    } catch (err) {
      console.error("[webhook] unhandled_exception", { message: err.message, stack: err.stack });
      return Response.json({ error: "Internal server error" }, { status: 500 });
    }
  }),
};