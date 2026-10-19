import { supabaseAdmin } from "./supabaseClient.ts";


interface CreateNotificationProps {
  userId: string;
  type: string;
  title: string;
  body?: string;
  data?: Record<string, unknown>;
}

export async function getAdminUserIds(): Promise<string[]> {
  const { data, error } = await supabaseAdmin
    .from("admins") 
    .select("id")
    .eq("role", "admin");

  if (error) {
    console.error("[notification] fetch_admins_failed", { message: error.message });
    return [];
  }
  
  return data.map((u) => u.id);
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

export async function createNotificationForMany(
  userIds: string[],
  notification: Omit<CreateNotificationProps, "userId">
) {
  if (userIds.length === 0) return;

  const rows = userIds.map((userId) => ({
    user_id: userId,
    ...notification,
  }));

  const { error } = await supabaseAdmin.from("notifications").insert(rows);

  if (error) {
    console.error("[notification] bulk_create_failed", { message: error.message, count: userIds.length });
  }

  return { error };
}