import { getPendingPaymentAmount, setPaymentReference } from "./payments.ts";

// --------------------------------------------------------------------------------------------//
// TYPES
// --------------------------------------------------------------------------------------------//

export type ServiceName = "membership" | "privacy_impact_assessment";

export interface CheckoutInput {
  subscriptionId: string;
  customerName: string;
  email: string;
  description: string;
}

// --------------------------------------------------------------------------------------------//
// CONSTANTS
// --------------------------------------------------------------------------------------------//

const PAYMONGO_API_URL = "https://api.paymongo.com/v1/checkout_sessions";

// --------------------------------------------------------------------------------------------//
// FUNCTIONS
// --------------------------------------------------------------------------------------------//

function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

export async function createCheckout(input: CheckoutInput): Promise<{ url: string }> {

  const { subscriptionId, customerName, email, description } = input;

  // Read at call time so importing this file never crashes on a missing var
  const secretKey = requireEnv("PAYMONGO_SECRET_KEY");
  const appOrigin = requireEnv("APP_ORIGIN");

  // Price always comes from the DB, never from the client
  const amount = Math.round((await getPendingPaymentAmount(subscriptionId)) * 100); // centavos

  const referenceNumber = crypto.randomUUID();

  const res = await fetch(PAYMONGO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(secretKey + ":")}`,
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
          line_items: [{ currency: "PHP", amount, name: description, quantity: 1 }],
          payment_method_types: ["card", "gcash", "grab_pay"],
          success_url: `${appOrigin}/success/membership?ref=${referenceNumber}`,
          cancel_url: `${appOrigin}/cancelled/membership`,
        },
      },
    }),
  });

  const body = await res.json();
  if (!res.ok) {
    console.error("PayMongo error:", JSON.stringify(body));
    throw new Error(`PayMongo checkout failed (${res.status})`);
  }

  // Attach the reference to the pending row created during registration
  await setPaymentReference(subscriptionId, referenceNumber);

  return { url: body.data.attributes.checkout_url };
}