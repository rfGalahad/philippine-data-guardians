import { UserPlus, UserMinus, Pencil, Clock, type LucideIcon } from "lucide-react";
import type { ActivityLog } from "@/lib/supabase/activity-log";
import { timeAgo } from "@/utils/date";

// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------

const ACTION_ICON: Record<string, LucideIcon> = {
  member_added: UserPlus,
  member_updated: Pencil,
  member_deleted: UserMinus,
};

const ACTION_COLOR: Record<string, string> = {
  member_added: "text-emerald-600 bg-emerald-50",
  member_updated: "text-amber-600 bg-amber-50",
  member_deleted: "text-rose-600 bg-rose-50",
};

// ---------------------------------------------------------------------------
// ACTIVITY LOG ITEM
// ---------------------------------------------------------------------------

export function ActivityLogItem({ log }: { log: ActivityLog }) {
  const Icon = ACTION_ICON[log.action] ?? Clock;
  const color = ACTION_COLOR[log.action] ?? "text-text-muted bg-surface-light";

  return (
    <li className="flex items-start gap-3 py-3">
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${color}`}>
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-text-primary">
          <span className="font-medium">{log.actorName}</span>{" "}
          <span className="text-text-secondary">{log.description}</span>
        </p>
        <span className="text-xs text-text-muted">{timeAgo(log.createdAt)}</span>
      </div>
    </li>
  );
}