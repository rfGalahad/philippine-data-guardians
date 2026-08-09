import type { MemberDetail } from "@/lib/supabase/members";
import { formatDate } from "@/utils/date";
import { formatCurrency } from "@/utils/number";
import { getInitials } from "@/utils/string";

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

const SUB_STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  expired: "bg-zinc-100 text-zinc-500 ring-zinc-500/20",
  cancelled: "bg-red-50 text-red-700 ring-red-600/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
};

function badgeStyle(map: Record<string, string>, value: string | null) {
  if (!value) return "bg-zinc-100 text-zinc-500 ring-zinc-500/20";
  return map[value.toLowerCase()] ?? "bg-zinc-100 text-zinc-500 ring-zinc-500/20";
}

function latestPayment(payments: MemberDetail["subscriptions"][number]["payments"]) {
  if (!payments || payments.length === 0) return null;
  return [...payments].sort((a, b) => {
    const at = a.paid_at ? new Date(a.paid_at).getTime() : 0;
    const bt = b.paid_at ? new Date(b.paid_at).getTime() : 0;
    return bt - at;
  })[0];
}

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------

interface MemberDetailContentProps {
  detail: MemberDetail;
}

export default function MemberDetailContent({ 
  detail 
}: MemberDetailContentProps ) {
  
  const fullName = [detail.firstName, detail.middleName, detail.lastName, detail.suffix]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {detail.photoUrl ? (
          <img
            src={detail.photoUrl}
            alt={fullName}
            className="h-16 w-16 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 font-body text-sm font-bold text-accent">
            {getInitials(fullName)}
          </div>
        )}
        <div>
          <div className="font-body text-base font-semibold text-text-primary">{fullName}</div>
          <div className="font-body text-sm text-text-secondary">{detail.email}</div>
          <div className="font-body text-sm text-text-secondary">{detail.contactNumber ?? "—"}</div>
          <div className="mt-1 font-body text-xs text-text-secondary">
            Member since {formatDate(detail.createdAt)}
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-body text-sm font-semibold text-text-primary">
          Subscriptions
        </h3>
        <div className="space-y-3">
          {detail.subscriptions.map((s) => {
            const lp = latestPayment(s.payments);
            return (
              <div key={s.subscriptionId} className="rounded-lg border border-black/10 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm font-semibold text-text-primary">
                    {s.serviceName} — {s.planName}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 font-body text-xs font-medium capitalize ring-1 ring-inset ${badgeStyle(
                      SUB_STATUS_STYLES,
                      s.subscriptionStatus
                    )}`}
                  >
                    {s.subscriptionStatus}
                  </span>
                </div>
                <div className="mt-1 font-body text-xs text-text-secondary">
                  {formatDate(s.startedAt)} → {formatDate(s.expiresAt)}
                </div>
                {lp && (
                  <div className="mt-2 font-body text-xs text-text-secondary">
                    Last payment: {formatCurrency(lp.amount)} via {lp.payment_method ?? "—"} (
                    {lp.payment_status ?? "—"}) on {formatDate(lp.paid_at)}
                    {lp.reference_number ? ` · Ref ${lp.reference_number}` : ""}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}