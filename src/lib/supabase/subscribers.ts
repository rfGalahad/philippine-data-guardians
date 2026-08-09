import { supabase } from "./client";


// DELETE SUBSCRIBER VIA SUBSCRIBER_ID
export async function deleteSubscriber(subscriberId: string): Promise<void> {
  const { error } = await supabase
    .from("subscribers")
    .delete()
    .eq("subscriber_id", subscriberId);

  if (error) throw error;
}