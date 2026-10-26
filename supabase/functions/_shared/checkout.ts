import { setPaymentReference } from "./payments.ts";

// --------------------------------------------------------------------------------------------//
// TYPES
// --------------------------------------------------------------------------------------------//

export type ServiceName = "membership" | "privacy_impact_assessment";

export interface CheckoutInput {
  paymentId: string;
  amount: number;
  customerName: string;
  email: string;
  description: string;
  serviceName: ServiceName;
  returnTo?: string;
  baseUrl?: string;
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
// HELPERS
// --------------------------------------------------------------------------------------------//

function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

function safeReturnPath(path?: string): string | null {
  return path && path.startsWith("/") && !path.startsWith("//") ? path : null;
}

// --------------------------------------------------------------------------------------------//
// FUNCTIONS
// --------------------------------------------------------------------------------------------//

export async function createCheckout(input: CheckoutInput): Promise<{ url: string }> {

  const { 
    paymentId,
    amount,
    customerName, 
    email, 
    description, 
    serviceName, 
    returnTo ,
    baseUrl
  } = input;

  const secretKey = requireEnv("PAYMONGO_SECRET_KEY");
  const appOrigin = baseUrl ?? requireEnv("APP_ORIGIN");
  const centavos = Math.round(amount * 100);
  const referenceNumber = crypto.randomUUID();
  
  await setPaymentReference(paymentId, referenceNumber);

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
          line_items: [{ 
            currency: "PHP", 
            amount: centavos, 
            name: description, 
            quantity: 1 
          }],
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