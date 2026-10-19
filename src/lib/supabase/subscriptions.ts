import { supabase } from "./client";

export async function removeSubscription(subscriptionId: string): Promise<void> {
  // Delete the payment first unless payments.subscription_id has ON DELETE CASCADE
  const { error: payErr } = await supabase
    .from("payments")
    .delete()
    .eq("subscription_id", subscriptionId);
  if (payErr) console.error("Failed to remove payment:", payErr);

  const { error } = await supabase
    .from("subscriptions")
    .delete()
    .eq("subscription_id", subscriptionId);
  if (error) console.error("Failed to remove subscription:", error);
}  