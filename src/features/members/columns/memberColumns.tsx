import type { Column } from "@/components/dataDisplay/CustomTable/DataTable";
import type { MemberListRow } from "@/lib/supabase/members";

import { formatDate } from "@/utils/date";
import { getInitials } from "@/utils/string";

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------
 
const SUB_STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  expired: "bg-zinc-100 text-zinc-500 ring-zinc-500/20",
  cancelled: "bg-red-50 text-red-700 ring-red-600/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
};

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  failed: "bg-red-50 text-red-700 ring-red-600/20",
  refunded: "bg-zinc-100 text-zinc-500 ring-zinc-500/20",
};

//-----------------------------------------------------------
// SUB COMPONENTS
//-----------------------------------------------------------

function badgeStyle(map: Record<string, string>, value: string | null) {
  if (!value) return "bg-zinc-100 text-zinc-500 ring-zinc-500/20";
  return map[value.toLowerCase()] ?? "bg-zinc-100 text-zinc-500 ring-zinc-500/20";
}

//-----------------------------------------------------------
// BUILD MEMBER COLUMN
//-----------------------------------------------------------

export function buildMemberColumns(
  onView: (id: string) => void,
  onUpdate: (id: string) => void
): Column<MemberListRow>[] {
  
  return [
    // NAME
    {
      key: "name", header: "Member", sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.photoUrl ? (
            <img
              src={row.photoUrl}
              alt={row.name}
              className="h-9 w-9 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 font-body text-xs font-bold text-accent">
              {getInitials(row.name)}
            </div>
          )}
          <div className="min-w-0">
            <div className="truncate font-body text-sm font-semibold text-text-primary">{row.name}</div>
            <div className="truncate font-body text-xs text-text-secondary">{row.email}</div>
          </div>
        </div>
      ),
    },

    // PLAN
    { 
      key: "planName", 
      header: "Plan", 
      sortable: true, 
      hideOnMobile: true 
    },

    // STATUS
    {
      key: "subscriptionStatus", header: "Status", sortable: true,
      render: (row) => (
         <span className={`... ${badgeStyle(SUB_STATUS_STYLES, row.subscriptionStatus)}`}>
          {row.subscriptionStatus}
        </span>
      ),
    },

    // STARTED AT
    // { 
    //   key: "startedAt", 
    //   header: "Started", 
    //   align: "right", 
    //   sortable: true, 
    //   hideOnMobile: true, 
    //   render: (row) => formatDate(row.startedAt) 
    // },

    // EXPIRES AT
    { 
      key: "expiresAt", 
      header: "Expires", 
      align: "right", 
      sortable: true, 
      render: (row) => formatDate(row.expiresAt) 
    },

    // PAYMENT STATUS
    {
      key: "paymentStatus", header: "Payment", align: "right", sortable: true,
      render: (row) => (
        <span className={`${badgeStyle(PAYMENT_STATUS_STYLES, row.paymentStatus)} inline-flex items-center rounded-full px-2.5 py-0.5 font-body text-xs font-medium capitalize ring-1 ring-inset`}>
          {row.paymentStatus ?? "No payment"}
        </span>
      ),
    },

    // ACTION
    {
      key: "subscriptionId", header: "", align: "right",
      render: (row) => (
        <div className="flex gap-2">
          <button 
            type="button" 
            onClick={() => onView(row.memberId)}
            className="cursor-pointer rounded-md border border-black/10 px-3 py-1.5 font-body text-xs font-medium text-text-primary transition hover:bg-black/5"
          >
            View
          </button>
          <button 
            type="button" 
            onClick={() => onUpdate(row.memberId)}
            className="cursor-pointer rounded-md border border-black/10 px-3 py-1.5 font-body text-xs font-medium text-text-primary transition hover:bg-black/5"
          >
            Update
          </button>
        </div>
      ),
    },
  ];
}