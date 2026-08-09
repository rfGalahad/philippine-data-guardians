import { markPaymentPaid, activateMember } from "../services/payment-service.ts";
import { maskEmail } from "../utils/helpers.ts";
import sendEmail from "../email/send-email.ts";

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface MembershipPaymentProps {
  name: string; 
  email: string; 
  planName: string; 
  referenceNumber: string
}

//-----------------------------------------------------------
// HANDLE MEMBERSHIP PAYMENT
//-----------------------------------------------------------

export async function handleMembershipPayment({ 
  name, 
  email, 
  planName, 
  referenceNumber 
}: MembershipPaymentProps ) {

  // UPDATE PAYMENT_STATUS TO "PAID"
  const { data: updated, error: updateError } = await markPaymentPaid(referenceNumber);

  if (updateError) {
    console.error("[webhook] payment_update_failed", { message: updateError.message });
    return Response.json({ error: "Failed to update payment" }, { status: 500 });
  }

  if (!updated || updated.length === 0) {
    console.error("[webhook] payment_not_found", { referenceNumber });
    return Response.json({ error: "Payment record not found" }, { status: 404 });
  }

  // SUBSCRIBER_ID
  const subscriberId = updated[0].subscriber_id;

  // UPDATE MEMBER_ID TO "PDG-YYYY-###"
  const { data: memberId, error: activationError } = await activateMember(subscriberId);
  
  if (activationError) {
    console.error("[webhook] member_activation_failed", {
      message: activationError.message,
      subscriberId,
    });
  }

  // SEND MEMBERSHIP EMAIL 
  await sendEmail({ 
    name,
    email,
    memberId, 
    subscriptionType: "membership",  
    planName 
  });
  
  console.log("[webhook] membership_payment_confirmed", { email: maskEmail(email), plan: planName });

  return Response.json({ success: true }, { status: 200 });
}