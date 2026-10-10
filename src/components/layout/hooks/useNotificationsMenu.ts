import { useState, useRef } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { useClickOutside } from "@/hooks/useClickOutside";


export function useNotificationsMenu(userId: string | undefined) {

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications(userId);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  useClickOutside(menuRef, close);

  const handleSelect = (id: string) => {
    markAsRead(id);
  };

  return {
    menuRef,
    isOpen,
    toggle,
    close,
    notifications,
    unreadCount,
    onSelect: handleSelect,
    onMarkAllRead: markAllAsRead,
  };
}