import { supabaseAdmin } from "./supabase-client.ts";

interface CreateNotificationProps {
  userId: string;
  type: string;
  title: string;
  body?: string;
  data?: Record<string, unknown>;
}

export async function createNotification({
  userId,
  type,
  title,
  body,
  data,
}: CreateNotificationProps) {
  const { error } = await supabaseAdmin.from("notifications").insert({
    user_id: userId,
    type,
    title,
    body,
    data,
  });

  if (error) {
    console.error("[notification] create_failed", { message: error.message, userId, type });
  }

  return { error };
}