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
  serviceName: ServiceName;
  // Where "Try again" should send the user (internal path only)
  returnTo?: string;
}

// --------------------------------------------------------------------------------------------//
// CONSTANTS
// --------------------------------------------------------------------------------------------//

const PAYMONGO_API_URL = "https://api.paymongo.com/v1/checkout_sessions";

// Route segment used by the frontend for each service
const SERVICE_ROUTE: Record<ServiceName, string> = {
  membership: "membership",
  privacy_impact_assessment: "privacy-impact-assessment",
};

// --------------------------------------------------------------------------------------------//
// FUNCTIONS
// --------------------------------------------------------------------------------------------//

function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

// Only allow internal paths, so the cancel page can't be used as an open redirect
function safeReturnPath(path?: string): string | null {
  return path && path.startsWith("/") && !path.startsWith("//") ? path : null;
}

export async function createCheckout(input: CheckoutInput): Promise<{ url: string }> {
  const { subscriptionId, customerName, email, description, serviceName, returnTo } = input;

  // Read at call time so importing this file never crashes on a missing var
  const secretKey = requireEnv("PAYMONGO_SECRET_KEY");
  const appOrigin = requireEnv("APP_ORIGIN");

  // Price always comes from the DB, never from the client
  const amount = Math.round((await getPendingPaymentAmount(subscriptionId)) * 100); // centavos

  const referenceNumber = crypto.randomUUID();

  // Save the reference BEFORE creating the session, so a paid webhook can never
  // arrive for a reference that isn't in your DB yet
  await setPaymentReference(subscriptionId, referenceNumber);

  const route = SERVICE_ROUTE[serviceName];
  const safeReturn = safeReturnPath(returnTo);

  const cancelUrl =
    `${appOrigin}/cancelled/${route}` +
    (safeReturn ? `?returnTo=${encodeURIComponent(safeReturn)}` : "");

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
          success_url: `${appOrigin}/success/${route}?ref=${referenceNumber}`,
          cancel_url: cancelUrl,
        },
      },
    }),
  });

  const body = await res.json();
  if (!res.ok) {
    console.error("PayMongo error:", JSON.stringify(body));
    throw new Error(`PayMongo checkout failed (${res.status})`);
  }

  return { url: body.data.attributes.checkout_url };
}