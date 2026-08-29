import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PanelLeftOpen,
  PanelLeftClose,
  type LucideIcon,
  Users,
  UserCheck
} from "lucide-react";
import BrandLogo from "@/components/common/BrandLogo";

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

export interface SidebarItem {
  key: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

export interface SidebarProps {
  items?: SidebarItem[];
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const DEFAULT_ITEMS: SidebarItem[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { key: "pdg-members", label: "PDG Members", icon: Users, path: "/admin/pdg-members" },
  { key: "subscribers", label: "Subscribers", icon: UserCheck, path: "/admin/subscribers" }
];

//-----------------------------------------------------------
// SIDEBAR
//-----------------------------------------------------------

export default function Sidebar({
  items = DEFAULT_ITEMS,
  collapsed: collapsedProp,
  onCollapsedChange,
}: SidebarProps) {

  const [collapsedState, setCollapsedState] = useState(collapsedProp ?? false);
  const collapsed = collapsedProp ?? collapsedState;

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsedState(next);
    onCollapsedChange?.(next);
  };

  return (
    <nav
      aria-label="Primary"
      className={`
        flex h-full shrink-0 flex-col
        border-r border-border bg-surface-2
        max-[960px]:w-17
        ${collapsed ? "w-17" : "w-58"}
      `}
    >
      <div className={`flex items-center border-b pl-6 ${collapsed ? "py-5" : "py-3.5"}`}>
        <BrandLogo variant={collapsed ? 3 : 2}/>
      </div>

      <ul className="flex flex-1 list-none flex-col gap-1 overflow-y-auto px-3 py-4 max-[960px]:px-2">
        {items.map(({ key, label, icon: Icon, path }) => (
          <li key={key}>
            <NavLink
              to={path}
              className={({ isActive }) =>
                `
                group flex h-10 items-center gap-3 rounded-md px-3
                font-sans text-sm font-medium no-underline transition-colors
                max-[960px]:justify-center max-[960px]:px-0
                ${collapsed ? "justify-center px-0" : ""}
                ${
                  isActive
                    ? "bg-accent-dim font-semibold text-accent"
                    : "border-transparent text-text-secondary hover:bg-surface-2 hover:text-text-secondary"
                }
              `
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    strokeWidth={1.9}
                    className={`
                      shrink-0 transition-colors
                      ${isActive ? "text-accent" : "text-text-secondary group-hover:text-text-secondary"}
                    `}
                  />
                  <span className={collapsed ? "hidden" : "max-[960px]:hidden"}>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* TOGGLE SIDEBAR */}
      <div className="flex border-t border-border px-3 py-3 max-[960px]:px-2">
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-pressed={collapsed}
          className="
            group flex h-9 w-9 items-center justify-center rounded-md
            text-white transition-colors
            hover:bg-surface-2 hover:text-text-secondary
            cursor-pointer
          "
        >
          {collapsed ? (
            <PanelLeftOpen
              size={18}
              strokeWidth={1.9}
              className="shrink-0 text-white group-hover:text-text-secondary"
            />
          ) : (
            <PanelLeftClose
              size={18}
              strokeWidth={1.9}
              className="shrink-0 text-white group-hover:text-text-secondary"
            />
          )}
        </button>
      </div>
    </nav>
  );
}