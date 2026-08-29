import { createCheckout } from "@/features/checkout/createCheckout";
import { getFullName } from "@/utils/string";

import type { RegistrationValues } from "../schema";


export async function createMemberCheckoutUrl(
  values: RegistrationValues,
  plan: string,
  result: { subscriber_id: string; subscription_id: string }
) {
  return createCheckout({
    subscriberId: result.subscriber_id,
    subscriptionId: result.subscription_id,
    customerName: getFullName(values),
    price: Number(values.cost),
    name: plan,
    serviceName: "membership",
    email: values.emailAddress,
    description: `${values?.plan} - PDG Membership Registration`,
    appOrigin: window.location.origin,
    cancelUrl: `${window.location.origin}`,
  });
}