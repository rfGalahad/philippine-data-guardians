import { createOrGetUser, generateMagicLink, generateRecoveryLink } from "../services/authService.ts";
import { maskEmail } from "../../_shared/utils.ts";

import sendEmail from "../email/sendEmail.ts";

//-----------------------------------------------------------
// FUNCTION
//-----------------------------------------------------------

export async function handleSubscriptionPayment(
  { email, planName }: { email: string; planName: string },
) {
  
  const { error: createError } = await createOrGetUser(email);

  if (createError?.code === "email_exists") {
    const { data: linkData, error: linkError } = await generateMagicLink(email);
    if (linkError) throw linkError;

    await sendEmail({ email, planName, actionLink: linkData.properties.action_link, isExisting: true });
    console.log("[webhook] existing_user_signin_email_sent", { email: maskEmail(email), plan: planName });
    return Response.json({ received: true }, { status: 200 });
  }

  if (createError) throw createError;

  const { data: linkData, error: linkError } = await generateRecoveryLink(email);
  if (linkError) throw linkError;

  await sendEmail({ email, planName, actionLink: linkData.properties.action_link, isExisting: false });
  console.log("[webhook] user_created_and_email_sent", { email: maskEmail(email), plan: planName });

  return Response.json({ success: true }, { status: 200 });
}