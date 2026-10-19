import { confirmMembershipPayment } from "../../_shared/members.ts";
import { createNotification } from "../services/notificationService.ts";
import sendEmail from "../email/sendEmail.ts";

export async function handleMembershipPayment({
  name,
  email,
  planName,
  referenceNumber,
}: MembershipPaymentProps) {
  
  // CONFIRM PAYMENT
  let result;
  try {
    result = await confirmMembershipPayment(referenceNumber);
  } catch (e) {
    // 500 makes PayMongo retry, and the transaction left nothing half-done
    console.error("[webhook] confirm_failed", { message: (e as Error).message, referenceNumber });
    return Response.json({ error: "Failed to confirm payment" }, { status: 500 });
  }

  if (result.status === "not_found" || result.status === "not_pending") {
    console.error("[webhook] payment_unusable", { referenceNumber, status: result.status });
    return Response.json({ error: "Payment record not found" }, { status: 404 });
  }

  // Duplicate delivery: already processed, don't notify or email again
  if (result.status === "already_paid") {
    return Response.json({ received: true, duplicate: true }, { status: 200 });
  }

  const { subscriber_id: subscriberId, member_id: memberId } = result;

  // SEND NOTIFICATION
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

  // SEND EMAIL
  try {
    await sendEmail({ name, email, memberId, subscriptionType: "membership", planName });
  } catch (e) {
    console.error("[webhook] email_failed", e);
  }

  return Response.json({ success: true }, { status: 200 });
}