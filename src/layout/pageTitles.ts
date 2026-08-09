import { LayoutDashboard, UserCheck, Users, type LucideIcon } from "lucide-react";

interface PageMeta {
  title: string;
  icon: LucideIcon;
}

export const PAGE_TITLES: Record<string, PageMeta> = {
  dashboard: { title: "Dashboard", icon: LayoutDashboard },
  "pdg-members": { title: "PDG Members", icon: Users },
  "subscribers": { title: "Subscribers", icon: UserCheck },
};