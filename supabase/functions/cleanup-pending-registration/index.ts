import { supabaseAdmin as admin } from "../_shared/supabaseAdmin.ts";
import {
  getStalePendingSubscriptionIds,
  deleteStalePendingPayments,
} from "../_shared/payments.ts";
import { photoPathFromUrl, removePhoto } from "../_shared/photos.ts";

// --------------------------------------------------------------------------------------------//
// CONSTANTS
// --------------------------------------------------------------------------------------------//

const MAX_AGE_HOURS = 24;

// --------------------------------------------------------------------------------------------//
// FUNCTIONS
// --------------------------------------------------------------------------------------------//

Deno.serve(async (req) => {
  
  if (req.headers.get("x-cron-secret") !== Deno.env.get("CRON_SECRET")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const cutoff = new Date(Date.now() - MAX_AGE_HOURS * 3600_000).toISOString();
  let removedRegistrations = 0;
  let removedPayments = 0;

  let subscriptionIds: string[];
  try {
    subscriptionIds = await getStalePendingSubscriptionIds(cutoff);
  } catch (e) {
    console.error("[cleanup] query_failed", e);
    return new Response("Failed", { status: 500 });
  }

  for (const subscriptionId of subscriptionIds) {
    try {
      const { data: sub, error: subErr } = await admin
        .from("subscriptions").select("subscriber_id")
        .eq("subscription_id", subscriptionId).maybeSingle();
      if (subErr) throw subErr;
      if (!sub) continue;

      const { data: result, error } = await admin.rpc("delete_abandoned_registration", {
        p_subscriber_id: sub.subscriber_id,
        p_cutoff: cutoff,
      });
      if (error) throw error;

      if (result?.deleted) {
        // Database is clean, now remove the file
        const path = photoPathFromUrl(result.photo_url);
        if (path) await removePhoto(path);
        removedRegistrations++;
      } else {
        // Renewal, active member, or fresh retry: remove only the stale unpaid rows
        await deleteStalePendingPayments(subscriptionId, cutoff);
        removedPayments++;
      }
    } catch (e) {
      console.error("[cleanup] failed_for_subscription", { subscriptionId, e });
    }
  }

  console.log("[cleanup] done", { removedRegistrations, removedPayments });
  return Response.json({ removedRegistrations, removedPayments });
});