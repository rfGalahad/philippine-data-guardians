import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Bell, LogOut, Settings, User, Loader2 } from "lucide-react";

import type { Role } from '@/features/auth/types/authTypes';
import { useAuth } from "@/features/auth/hooks/useAuth";

import { useToast } from "@/components/Toast";
import { getInitials } from "@/utils/string";

import { PAGE_TITLES } from "./pageTitles";

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const ROLE_LABEL: Record<Role, string> = {
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
};

const ROLE_BADGE_CLASS: Record<Role, string> = {
  admin: "bg-[#f76f19]/15 text-[#f76f19]",
  editor: "bg-[#4f9dff]/15 text-[#4f9dff]",
  viewer: "bg-[#8a8a8a]/15 text-[#8a8a8a]",
};

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

const Topbar = () => {

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { user, logout } = useAuth();

  const toast = useToast();
  const menuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


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
        {/* NOTIFICATION BUTTON */}
        <button
          className="
            relative flex h-9 w-9 items-center justify-center rounded-md
            border border-field-border text-text-primary
            transition-colors hover:border-border
            
            cursor-pointer
          "
          aria-label="Notifications"
        >
          <Bell size={18} />
          {/*notifCount > 0 && (
            <span
              className="
                absolute right-0.75 top-0.75 flex h-4 min-w-4
                items-center justify-center rounded-full border-[1.5px]
                px-0.75 text-[10px] font-bold leading-none
                border-surface bg-accent
                text-bg
              "
            >
              {notifCount > 99 ? "99+" : notifCount}
            </span>
          )*/}
        </button>

        {/* USER MENU */}
        <div className="relative" ref={menuRef}>
          <button
            className="
              relative flex h-9 w-9 items-center justify-center rounded-full
              border border-field-border font-sans text-xs font-medium
              text-text-primary transition-colors
              hover:border-border
              cursor-pointer
            "
            aria-label="User menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
            disabled={!user}
          >
            <span className="pointer-events-none">
              {getInitials(user?.name)}
            </span>
          </button>

          {menuOpen && user && (
            <div
              className="
                absolute right-0 top-[calc(100%+8px)] z-50 min-w-50
                rounded-md border p-2 shadow-[0_8px_24px_rgba(0,0,0,0.24)]
                border-field-border bg-surface-light
              "
            >
              <div className="flex flex-col gap-0.5 px-3 py-2">
                <span className="font-sans text-[13px] font-semibold text-text-primary">
                  {user.name}
                </span>
                <span className="font-sans text-xs text-text-muted">
                  {user.email}
                </span>
                <span
                  className={`mt-1 self-start rounded-full px-1.75 py-px text-[10px] font-bold uppercase tracking-wide ${ROLE_BADGE_CLASS[user.role]}`}
                >
                  {ROLE_LABEL[user.role]}
                </span>
              </div>

              <div className="my-2 h-px bg-border" />

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

              <div className="my-2 h-px bg-border" />

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