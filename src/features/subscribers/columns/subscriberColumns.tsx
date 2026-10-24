import type { Column } from "@/components/dataDisplay/CustomTable/DataTable";
import type {
  PaymentFlag,
  SubscriberListRow,
  SubscriberStatus,
} from "@/lib/supabase/subscribers";

import { formatDate } from "@/utils/date";
import { getFullName } from "@/utils/string";

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const MAX_VISIBLE_SUBSCRIPTIONS = 2;

const BADGE_BASE =
  "inline-flex items-center rounded-full px-2.5 py-0.5 font-body text-xs font-medium ring-1 ring-inset";

export const SUBSCRIBER_STATUS_LABELS: Record<SubscriberStatus, string> = {
  active: "Active",
  expiring_soon: "Expiring soon",
  expired: "Expired",
  no_subscription: "No subscription",
};

const SUBSCRIBER_STATUS_STYLES: Record<SubscriberStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  expiring_soon: "bg-amber-50 text-amber-700 ring-amber-600/20",
  expired: "bg-red-50 text-red-700 ring-red-600/20",
  no_subscription: "bg-zinc-100 text-zinc-500 ring-zinc-500/20",
};

export const PAYMENT_FLAG_LABELS: Record<PaymentFlag, string> = {
  paid: "Paid",
  pending: "Pending",
  failed: "Failed",
};

const PAYMENT_FLAG_STYLES: Record<PaymentFlag, string> = {
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  failed: "bg-red-50 text-red-700 ring-red-600/20",
};

const NEUTRAL_BADGE = "bg-zinc-100 text-zinc-500 ring-zinc-500/20";

//-----------------------------------------------------------
// BUILD SUBSCRIBER COLUMN
//-----------------------------------------------------------

export function buildSubscriberColumns(
  onView: (id: string) => void,
): Column<SubscriberListRow>[] {

  return [
    // SUBSCRIBER
    {
      key: "lastName",
      header: "Subscriber",
      sortable: true,
      render: (row) => {
        const fullName = getFullName(row);

        return (
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <div className="truncate font-body text-sm font-semibold text-text-primary">
                {fullName}
              </div>
              <div className="truncate font-body text-xs text-text-secondary">
                {row.email}
              </div>
            </div>
          </div>
        );
      },
    },

    // SUBSCRIPTIONS (service + plan chips)
    {
      key: "subscriptions",
      header: "Subscriptions",
      hideOnMobile: true,
      render: (row) => {
        if (row.subscriptions.length === 0) {
          return <span className="font-body text-xs text-text-secondary">—</span>;
        }

        const visible = row.subscriptions.slice(0, MAX_VISIBLE_SUBSCRIPTIONS);
        const hidden = row.subscriptions.slice(MAX_VISIBLE_SUBSCRIPTIONS);

        return (
          <div className="flex flex-wrap items-center gap-1.5">
            {visible.map((s) => (
              <span
                key={s.subscriptionId}
                className="inline-flex items-center gap-1 rounded-md border border-black/10 px-2 py-0.5 font-body text-xs"
              >
                <span className="font-medium text-text-primary">{s.serviceName}</span>
                <span className="text-text-secondary">{s.planName}</span>
              </span>
            ))}

            {hidden.length > 0 && (
              <span
                className="font-body text-xs text-text-secondary"
                title={hidden.map((s) => `${s.serviceName} ${s.planName}`).join(", ")}
              >
                +{hidden.length}
              </span>
            )}
          </div>
        );
      },
    },

    // STATUS
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => (
        <span className={`${BADGE_BASE} ${SUBSCRIBER_STATUS_STYLES[row.status]}`}>
          {SUBSCRIBER_STATUS_LABELS[row.status]}
        </span>
      ),
    },

    // NEXT EXPIRY
    {
      key: "nextExpiry",
      header: "Next expiry",
      align: "right",
      sortable: true,
      render: (row) => formatDate(row.nextExpiry),
    },

    // PAYMENT
    {
      key: "paymentFlag",
      header: "Payment",
      align: "right",
      sortable: true,
      hideOnMobile: true,
      render: (row) => (
        <span
          className={`${BADGE_BASE} ${
            row.paymentFlag ? PAYMENT_FLAG_STYLES[row.paymentFlag] : NEUTRAL_BADGE
          }`}
        >
          {row.paymentFlag ? PAYMENT_FLAG_LABELS[row.paymentFlag] : "No payment"}
        </span>
      ),
    },

    // SUBSCRIBED (CREATED AT)
    {
      key: "createdAt",
      header: "Subscribed",
      align: "right",
      sortable: true,
      hideOnMobile: true,
      render: (row) => formatDate(row.createdAt),
    },

    // ACTION
    {
      key: "subscriberId",
      header: "",
      align: "right",
      render: (row) => {
        const id = row.subscriberId;
        if (!id) return null;

        return (
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => onView(id)}
              className="cursor-pointer rounded-md border border-black/10 px-3 py-1.5 font-body text-xs font-medium text-text-primary transition hover:bg-black/5"
            >
              View
            </button>
          </div>
        );
      },
    },
  ];
}