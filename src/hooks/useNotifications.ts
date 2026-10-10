import { useEffect, useState, useCallback } from "react";
import { 
  type Notification, 
  fetchNotifications,
  subscribeToNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from "@/lib/supabase/notifications";


export function useNotifications(userId: string | undefined) {
  
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    fetchNotifications(userId)
      .then((data) => {
        if (!cancelled) setNotifications(data);
      })
      .catch((err) => {
        console.error("Failed to fetch notifications:", err);
      });

    const unsubscribe = subscribeToNotifications(userId, (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev]);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback(async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.notification_id === id ? { ...n, read: true } : n))
    );
    try {
      await markNotificationAsRead(id);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      setNotifications((prev) =>
        prev.map((n) => (n.notification_id === id ? { ...n, read: false } : n))
      );
    }
  }, []); 

  const markAllAsRead = useCallback(async () => {
    if (!userId) return;
    const previous = notifications;
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await markAllNotificationsAsRead(userId);
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
      setNotifications(previous);
    }
  }, [userId, notifications]);

  return { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead 
  };
}