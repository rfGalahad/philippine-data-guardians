import { supabase } from './client';

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

export type Notification = {
  notification_id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  data: Record<string, unknown> | null;
  read: boolean;
  created_at: string;
};

//-----------------------------------------------------------
// FUNCTIONS
//-----------------------------------------------------------

export function subscribeToNotifications(
  userId: string,
  onInsert: (notification: Notification) => void
) {
  const channel = supabase
    .channel(`notifications:${userId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`,
    }, (payload) => {
      onInsert(payload.new as Notification);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export async function fetchNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function markNotificationAsRead(id: string): Promise<Notification> {
  const { data, error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("notification_id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);

  if (error) throw error;
}