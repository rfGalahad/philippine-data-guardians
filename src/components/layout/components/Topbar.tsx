import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Bell, LogOut, Settings, User, Loader2 } from "lucide-react";

import type { Role } from '@/features/auth/types/authTypes';
import { useAuth } from "@/features/auth/hooks/useAuth";

import { useToast } from "@/components/feedback/Toast";
import { getInitials } from "@/utils/string";

import IconButton from "@/components/ui/IconButton";

import { useNotificationsMenu } from "../hooks/useNotificationsMenu";
import { useUserMenu } from "../hooks/useUserMenu";
import { PAGE_TITLES } from "../pageTitles";
import { timeAgo } from "@/utils/date";


//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const ROLE_LABEL: Record<Role, string> = {
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
  unknown: "Unknown",
};

const ROLE_BADGE_CLASS: Record<Role, string> = {
  admin: "bg-[#f76f19]/15 text-[#f76f19]",
  editor: "bg-[#4f9dff]/15 text-[#4f9dff]",
  viewer: "bg-[#8a8a8a]/15 text-[#8a8a8a]",
  unknown: "bg-gray-100 text-gray-500",
};

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

const Topbar = () => {

  const [loggingOut, setLoggingOut] = useState(false);

  const { user, logout } = useAuth();

  const toast = useToast();
  const notifMenu = useNotificationsMenu(user?.id);
  const userMenu = useUserMenu();

  const { menuRef: notifMenuRef } = notifMenu;
  const { menuRef: userMenuRef } = userMenu;

  const { pathname } = useLocation();
  const lastSegment = pathname.split("/").filter(Boolean).pop() ?? "";
  const page = PAGE_TITLES[lastSegment] ?? "";
  const PageIcon = page?.icon;

 
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      logout();
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout Failed!")
      setLoggingOut(false);    
    }
  };


  return (
    <header
      className="
        flex h-14 animate-[topbar-slide-down_300ms_cubic-bezier(0.4,0,0.2,1)_both]
        items-center justify-between gap-4 border-b px-10 py-8
        border-field-border bg-surface-light-2
      "
    >
      <div className="flex items-center gap-2">
        {PageIcon && <PageIcon size={18} className="text-text-primary" />}
        <h1 className="font-sans text-[15px] font-semibold text-text-primary">
          {page?.title}
        </h1>
      </div>

      <div className="flex min-w-30 items-center justify-end gap-3">
        {/* NOTIFICATIONS */}
        <div className="relative" ref={notifMenuRef}>
          <IconButton
            icon={Bell}
            label="Notifications"
            badge={notifMenu.unreadCount}
            onClick={notifMenu.toggle}
          />

          {notifMenu.isOpen && (
            <div
              className="
                absolute top-[calc(100%+8px)] right-0
                w-80 max-h-96 overflow-y-auto
                bg-surface-light border border-field-border 
                rounded-md shadow-[0_8px_24px_rgba(0,0,0,0.24)]
                p-2 z-50
                scrollbar-thin [scrollbar-color:var(--color-border)_transparent]
                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-border-light
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb:hover]:bg-border
              "
            >
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-1.5">
                  <Bell size={14} className="text-text-muted" />
                  <span className="font-body text-[13px] font-semibold text-text-primary">
                    Notifications
                  </span>
                </div>
                {notifMenu.unreadCount > 0 && (
                  <button
                    onClick={notifMenu.onMarkAllRead}
                    className="font-body text-xs text-text-secondary hover:underline cursor-pointer bg-transparent border-none"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="h-px bg-border-light my-1" />

              {notifMenu.notifications.length === 0 ? (
                <p className="px-3 py-4 text-xs text-text-muted text-center">
                  No notifications yet
                </p>
              ) : (
                notifMenu.notifications.map((n) => (
                  <button
                    key={n.notification_id}
                    onClick={() => notifMenu.onSelect(n.notification_id)}
                    className={`
                      group relative flex w-full items-start gap-2 px-3 py-2.5
                      border-none rounded-sm text-left
                      bg-surface-light
                      cursor-pointer transition-colors
                      ${!n.read
                        ? "bg-surface-light-2 hover:bg-surface-light-3"
                        : "bg-transparent hover:bg-surface-light-3"}
                    `}
                  >
                    {/* unread indicator */}
                    <span
                      className={`
                        mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full
                        ${!n.read ? "bg-accent" : "bg-transparent"}
                      `}
                    />

                    <div className="flex flex-1 flex-col items-start gap-0.5 min-w-0">
                      <span
                        className={`
                          font-body text-[13px] leading-snug
                          ${!n.read ? "font-semibold text-text-primary" : "font-normal text-text-secondary"}
                        `}
                      >
                        {n.title}
                      </span>
                      {n.body && (
                        <>
                          <span
                            className={`
                              font-body text-xs leading-snug
                              ${!n.read ? "text-text-secondary" : "text-text-muted"}
                            `}
                          >
                            {n.body}
                          </span>  
                          <span
                            className={`
                              font-body text-xs leading-snug
                              ${!n.read ? "text-text-secondary" : "text-text-muted"}
                            `}
                          >
                            {timeAgo(n.created_at)}
                          </span>
                        </>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* USER MENU */}
        <div className="relative" ref={userMenuRef}>
          <button
            className="
              relative flex h-9 w-9 items-center justify-center rounded-full
              border border-field-border font-sans text-xs font-medium
              text-text-primary transition-colors
              hover:border-border
              cursor-pointer
            "
            aria-label="User menu"
            aria-expanded={userMenu.isOpen}
            onClick={userMenu.toggle}
            disabled={!user}
          >
            <span className="pointer-events-none">
              {getInitials(user?.name)}
            </span>
          </button>

          {userMenu.isOpen && (
            <div
              className="
                absolute right-0 top-[calc(100%+8px)] z-50 min-w-50
                rounded-md border p-2 shadow-[0_8px_24px_rgba(0,0,0,0.24)]
                border-field-border bg-surface-light
              "
            >
              <div className="flex flex-col gap-0.5 px-3 py-2">
                <span className="font-sans text-[13px] font-semibold text-text-primary">
                  {user?.name ?? "User"} 
                </span>
                <span className="font-sans text-xs text-text-muted">
                  {user?.email ?? "sample@email.com"}
                </span>
                <span
                  className={`mt-1 self-start rounded-full px-1.75 py-px text-[10px] font-bold uppercase tracking-wide ${ROLE_BADGE_CLASS[user?.role ?? "unknown"]}`}
                >
                  {ROLE_LABEL[user?.role ?? "unknown"]}
                </span>
              </div>

              <div className="my-2 h-px bg-border-light" />

              <button
                className="
                  flex w-full items-center gap-2 rounded-sm px-3 py-2 font-sans
                  text-[13px] text-text-secondary transition-colors
                  hover:bg-surface-light-2 hover:text-text-primary
                  cursor-pointer
                "
              >
                <User size={15} />
                Profile
              </button>
              <button
                className="
                  flex w-full items-center gap-2 rounded-sm px-3 py-2 font-sans
                  text-[13px] text-text-secondary transition-colors
                  hover:bg-surface-light-2 hover:text-text-primary
                  cursor-pointer  
                "
              >
                <Settings size={15} />
                Settings
              </button>

              <div className="my-2 h-px bg-border-light" />

              <button
                className="
                  flex w-full items-center gap-2 rounded-sm px-3 py-2 font-sans
                  text-[13px] text-text-secondary transition-colors
                  hover:bg-surface-light-2 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-70
                  cursor-pointer
                "
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <LogOut size={15} />
                )}
                {loggingOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;