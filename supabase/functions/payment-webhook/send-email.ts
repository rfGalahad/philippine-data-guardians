import { CONFIG } from "./config.ts";
import { subscriptionEmail } from "./subscription-email.ts";
import { membershipEmail } from "./membership-email.ts";

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const RESEND_API_URL = "https://api.resend.com/emails";

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

type SendEmailInput =
  | {
      subscriptionType: "membership";
      email: string;
    }
  | {
      subscriptionType?: undefined;
      email: string;
      planName: string;
      actionLink: string;
      isExisting: boolean;
    };

//-----------------------------------------------------------
// SUB FUNCTION
//-----------------------------------------------------------

async function sendViaResend(
  to: string, 
  subject: string, 
  html: string
) {
  const res = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: CONFIG.emailFrom,
      to,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Resend error (${res.status}): ${errorText}`);
  }
}

//-----------------------------------------------------------
// MAIN FUNCTION
//-----------------------------------------------------------

export default async function sendEmail(input: SendEmailInput) {

  if (input.subscriptionType === "membership") {
    await sendViaResend(
      input.email,
      `You're officially a PDG member!`,
      membershipEmail(input.email, CONFIG.logoUrl, ""),
    );
    return;
  }

  const { email, planName, actionLink, isExisting } = input;

  const subject = isExisting
    ? `You already have an account — sign in here`
    : `Welcome! Your ${planName} account is ready`;

  await sendViaResend(
    email,
    subject,
    subscriptionEmail(planName, actionLink, CONFIG.logoUrl, isExisting),
  );
}