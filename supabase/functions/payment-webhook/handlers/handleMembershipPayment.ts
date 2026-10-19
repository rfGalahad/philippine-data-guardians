import { supabaseAdmin } from "../services/supabaseClient.ts";
import { createNotification } from '../services/notificationService.ts'
import sendEmail from "../email/sendEmail.ts";

//-----------------------------------------------------------
// HELPERS
//-----------------------------------------------------------

function maskEmail(email: string): string {
  return email.replace(/(.{2}).+(@.+)/, "$1***$2");
}

//-----------------------------------------------------------
// FUNCTIONS
//-----------------------------------------------------------

export async function handleMembershipPayment({ 
  name, 
  email, 
  planName, 
  referenceNumber 
}: MembershipPaymentProps) {

  // UPDATE MEMBERSHIP PAYMENT
  const { data, error } = await supabaseAdmin.rpc("confirm_membership_payment", {
    p_reference_number: referenceNumber,
  });

  if (error) {
    // 500 makes PayMongo retry, and the transaction left nothing half-done
    console.error("[webhook] confirm_failed", { message: error.message, referenceNumber });
    return Response.json({ error: "Failed to confirm payment" }, { status: 500 });
  }

  if (data.status === "not_found" || data.status === "not_pending") {
    console.error("[webhook] payment_unusable", { referenceNumber, status: data.status });
    return Response.json({ error: "Payment record not found" }, { status: 404 });
  }

  // Duplicate delivery: already processed, don't notify or email again
  if (data.status === "already_paid") {
    return Response.json({ received: true, duplicate: true }, { status: 200 });
  }

  const { subscriber_id: subscriberId, member_id: memberId } = data;

  // The payment is confirmed now, so a failed notification or email must not cause a 500
  try {
    await createNotification({
      userId: subscriberId,
      type: "payment_confirmed",
      title: "Payment confirmed",
      body: `Your ${planName} membership is now active.`,
      data: { referenceNumber, planName, memberId },
    });
  } catch (e) {
    console.error("[webhook] notification_failed", e);
  }

  try {
    await sendEmail({ 
      name, 
      email, 
      memberId, 
      subscriptionType: "membership", 
      planName 
    });
  } catch (e) {
    console.error("[webhook] email_failed", e);
  }

  console.log("[webhook] membership_payment_confirmed", { email: maskEmail(email), plan: planName });

  return Response.json({ success: true }, { status: 200 });
}