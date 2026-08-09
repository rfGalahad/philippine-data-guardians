const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const checkoutEndpoint = `${supabaseUrl}/functions/v1/create-checkout`;

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

export type ServiceName = 'membership' | 'privacy_impact_assessment';

interface CreateCheckoutParams {
  subscriberId: string;
  subscriptionId: string;
  customerName: string;
  price: number | string;
  name: string;
  serviceName: ServiceName;
  email: string;
  description?: string;
  appOrigin: string;
  cancelUrl?: string;
}

export const createCheckout = async ({
  subscriberId,
  subscriptionId,
  customerName,
  price,
  name,
  serviceName,
  email,
  description,
  appOrigin,
  cancelUrl,
}: CreateCheckoutParams) => {

  const response = await fetch(
    checkoutEndpoint,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${anonKey}`,
        apikey: anonKey
      },
      body: JSON.stringify({
        subscriberId,
        subscriptionId,
        customerName,
        amount: Math.round(parseFloat(String(price).replace(/[^0-9.]/g, '')) * 100),
        planName: name,
        serviceName,
        description,
        email,
        appOrigin,
        cancelUrl
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? 'Checkout failed');
  }

  return data;
};