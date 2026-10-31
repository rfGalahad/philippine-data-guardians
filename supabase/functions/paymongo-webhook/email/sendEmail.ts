import { subscriptionEmail } from "./subscriptionEmail.ts";
import { membershipEmail } from "./membershipEmail.ts";
import type { IssuedId } from "../../_shared/issueMemberId.ts";

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const RESEND_API_URL = "https://api.resend.com/emails";
const EMAIL_FROM = "Philippine Data Guardians <members@philippinedataguardians.org>";
const LOGO_URL = "https://res.cloudinary.com/diuruuyas/image/upload/v1779172364/logo-pdg-1_gojiba.png";

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

type SendEmailInput =
  | {
      subscriptionType: "membership";
      email: string;
      name: string;
      memberId: string;
      planName: string;
      membershipType: string;
      memberSince: Date;
      idPdf: IssuedId | null;
    }
  | {
      subscriptionType?: undefined;
      email: string;
      planName: string;
      actionLink: string;
      isExisting: boolean;
    };

interface Attachment {
  filename: string;
  content: string; // base64
}

//-----------------------------------------------------------
// SUB FUNCTION
//-----------------------------------------------------------

async function sendViaResend(
  to: string,
  subject: string,
  html: string,
  attachments?: Attachment[],
) {
  const res = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to,
      subject,
      html,
      ...(attachments?.length ? { attachments } : {}),
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
    const { idPdf } = input;

    await sendViaResend(
      input.email,
      `You're officially a PDG member!`,
      membershipEmail(
        input.name,
        input.email,
        input.memberId,
        LOGO_URL,
        input.membershipType,
        input.memberSince,
        idPdf?.downloadUrl ?? null, // new, see below
        !!idPdf,                    // new: whether the attachment exists
      ),
      idPdf ? [{ filename: idPdf.filename, content: idPdf.base64 }] : undefined,
    );
    return;
  }

  // TypeScript has narrowed `input` to the subscription variant here
  const { email, planName, actionLink, isExisting } = input;

  const subject = isExisting
    ? `You already have an account — sign in here`
    : `Welcome! Your ${planName} account is ready`;

  await sendViaResend(
    email,
    subject,
    subscriptionEmail(planName, actionLink, LOGO_URL, isExisting),
  );
}