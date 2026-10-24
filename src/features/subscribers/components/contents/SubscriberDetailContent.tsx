import type { SubscriberDetail } from "@/lib/supabase/subscribers";
import type { Payment } from "@/lib/supabase/payments";
import type { Subscription } from "@/lib/supabase/subscriptions";

import { formatDate } from "@/utils/date";
import { formatCurrency } from "@/utils/number";
import { getFullName, getInitials } from "@/utils/string";

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

interface SubscriberDetailContentProps {
  detail: SubscriberDetail;
}

type Tone = "success" | "warning" | "danger" | "neutral";

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

const BORDER = "border-[rgba(5,50,97,0.08)]";
const CARD = `rounded-xl border ${BORDER} bg-white`;
const DAY_MS = 1000 * 60 * 60 * 24;

const TONE_CLASS: Record<Tone, { pill: string; dot: string }> = {
  success: { pill: "bg-green-50 text-green-700", dot: "bg-green-500" },
  warning: { pill: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  danger: { pill: "bg-red-50 text-red-700", dot: "bg-red-500" },
  neutral: { pill: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
};

function paymentTone(status: string): Tone {
  switch (status.toLowerCase()) {
    case "paid":
    case "completed":
    case "success":
    case "succeeded":
      return "success";
    case "pending":
      return "warning";
    case "failed":
    case "cancelled":
      return "danger";
    default:
      return "neutral";
  }
}

/** Describes time left on an active subscription, plus how far through its term it is. */
function getTermInfo(subscription: Subscription): {
  label: string;
  tone: Tone;
  progress: number | null;
} | null {
  if (subscription.status !== "active" || !subscription.expiresAt) return null;

  const now = Date.now();
  const start = new Date(subscription.startedAt).getTime();
  const end = new Date(subscription.expiresAt).getTime();
  if (Number.isNaN(end)) return null;

  const daysLeft = Math.ceil((end - now) / DAY_MS);
  const total = end - start;
  const progress =
    Number.isNaN(start) || total <= 0 ? null : Math.min(1, Math.max(0, (now - start) / total));

  if (daysLeft < 0) return { label: "Past expiry date", tone: "danger", progress: 1 };
  if (daysLeft === 0) return { label: "Expires today", tone: "danger", progress };
  if (daysLeft <= 7) {
    return {
      label: `Expires in ${daysLeft} ${daysLeft === 1 ? "day" : "days"}`,
      tone: "warning",
      progress,
    };
  }
  return { label: `${daysLeft} days left`, tone: "success", progress };
}

// ---------------------------------------------------------------------------
// SUB-COMPONENTS
// ---------------------------------------------------------------------------

function Pill({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  const { pill, dot } = TONE_CLASS[tone];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 font-body text-xs font-medium capitalize ${pill}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {children}
    </span>
  );
}

function StatusBadge({ status }: { status: "active" | "expired" }) {
  return <Pill tone={status === "active" ? "success" : "neutral"}>{status}</Pill>;
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className={`${CARD} px-3 py-3 sm:px-4`}>
      <div className="font-body text-xs text-text-secondary">{label}</div>
      <div className="mt-1 truncate font-body text-lg font-semibold tabular-nums text-text-primary sm:text-xl">
        {value}
      </div>
      {hint && <div className="mt-0.5 font-body text-xs text-text-secondary">{hint}</div>}
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="font-body text-xs text-text-secondary">{label}</dt>
      <dd className="mt-0.5 truncate font-body text-sm font-medium tabular-nums text-text-primary">
        {value}
      </dd>
    </div>
  );
}

function PaymentRow({ payment }: { payment: Payment }) {
  const details = [
    payment.paidAt ? formatDate(payment.paidAt) : "Not paid yet",
    payment.paymentMethod,
    payment.renewalCount > 0 ? `Renewal ${payment.renewalCount}` : null,
  ].filter(Boolean);

  return (
    <li className="flex items-start justify-between gap-3 py-3">
      <div className="min-w-0">
        <div className="truncate font-body text-sm font-medium text-text-primary">
          {payment.referenceNumber}
        </div>
        <div className="mt-0.5 font-body text-xs text-text-secondary">
          {details.join(" · ")}
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <div className="font-body text-sm font-semibold tabular-nums text-text-primary">
          {formatCurrency(payment.amount)}
        </div>
        <Pill tone={paymentTone(payment.paymentStatus)}>{payment.paymentStatus}</Pill>
      </div>
    </li>
  );
}

function SubscriptionCard({ subscription }: { subscription: Subscription }) {
  const { payments } = subscription;
  const isActive = subscription.status === "active";
  const term = getTermInfo(subscription);

  return (
    <article className={`${CARD} overflow-hidden`}>
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="truncate font-body text-base font-semibold text-text-primary">
              {subscription.serviceName}
            </h4>
            <p className="mt-0.5 font-body text-sm text-text-secondary">
              {subscription.planName}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <StatusBadge status={subscription.status} />
            <div className="font-body text-sm font-semibold tabular-nums text-text-primary">
              {formatCurrency(subscription.price)}
            </div>
          </div>
        </div>

        {term && (
          <div className="mt-4">
            <div className="flex items-center justify-between gap-2 font-body text-xs">
              <span
                className={
                  term.tone === "danger"
                    ? "font-medium text-red-700"
                    : term.tone === "warning"
                      ? "font-medium text-amber-700"
                      : "text-text-secondary"
                }
              >
                {term.label}
              </span>
              {term.progress !== null && (
                <span className="tabular-nums text-text-secondary">
                  {Math.round(term.progress * 100)}% of term used
                </span>
              )}
            </div>
            {term.progress !== null && (
              <div
                role="progressbar"
                aria-label="Subscription term used"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(term.progress * 100)}
                className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[rgba(5,50,97,0.08)]"
              >
                <div
                  className={`h-full rounded-full ${TONE_CLASS[term.tone].dot}`}
                  style={{ width: `${term.progress * 100}%` }}
                />
              </div>
            )}
          </div>
        )}

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
          <Field label="Started" value={formatDate(subscription.startedAt)} />
          <Field
            label={isActive ? "Expires" : "Expired"}
            value={subscription.expiresAt ? formatDate(subscription.expiresAt) : "No expiry"}
          />
          <Field label="Renewals" value={subscription.renewalCount} />
          <Field label="Total paid" value={formatCurrency(subscription.totalPaid)} />
        </dl>
      </div>

      <details className={`group border-t ${BORDER}`}>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 bg-[rgba(5,50,97,0.02)] px-4 py-3 font-body text-sm font-medium text-accent-2 transition-colors hover:bg-[rgba(5,50,97,0.04)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent sm:px-5 [&::-webkit-details-marker]:hidden">
          <span>Payment history ({payments.length})</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="h-4 w-4 transition-transform group-open:rotate-180"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </summary>

        {payments.length > 0 ? (
          <ul className={`divide-y divide-[rgba(5,50,97,0.08)] px-4 sm:px-5`}>
            {payments.map((payment) => (
              <PaymentRow key={payment.paymentId} payment={payment} />
            ))}
          </ul>
        ) : (
          <p className="px-4 py-4 font-body text-sm text-text-secondary sm:px-5">
            No payments recorded for this subscription.
          </p>
        )}
      </details>
    </article>
  );
}

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------

export default function SubscriberDetailContent({ detail }: SubscriberDetailContentProps) {
  const fullName = getFullName(detail);

  return (
    <div className="space-y-6">
      {/* Profile */}
      <section aria-label="Subscriber profile" className={`${CARD} flex items-start gap-4 p-4 sm:p-5`}>
        <div
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-2/15 font-body text-base font-semibold text-accent-2"
        >
          {getInitials(fullName)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h2 className="min-w-0 truncate font-body text-lg font-semibold text-text-primary">
              {fullName}
            </h2>
            <StatusBadge status={detail.status} />
          </div>

          <dl className="mt-2 space-y-1 font-body text-sm text-text-secondary">
            <div className="flex gap-2">
              <dt className="sr-only">Email</dt>
              <dd className="min-w-0 truncate">
                <a
                  href={`mailto:${detail.email}`}
                  className="hover:text-accent-2 hover:underline focus-visible:outline-2 focus-visible:outline-accent"
                >
                  {detail.email}
                </a>
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="sr-only">Contact number</dt>
              <dd>
                {detail.contactNumber ? (
                  <a
                    href={`tel:${detail.contactNumber}`}
                    className="hover:text-accent-2 hover:underline focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    {detail.contactNumber}
                  </a>
                ) : (
                  "No contact number"
                )}
              </dd>
            </div>
          </dl>

          <p className="mt-3 font-body text-xs text-text-secondary">
            Subscriber since {formatDate(detail.createdAt)}
          </p>
        </div>
      </section>

      {/* Summary */}
      <section aria-label="Summary" className="grid grid-cols-3 gap-2 sm:gap-3">
        <Stat label="Active" value={detail.activeSubscriptionCount} />
        <Stat label="Subscriptions" value={detail.subscriptions.length} />
        <Stat label="Total paid" value={formatCurrency(detail.totalPaid)} />
      </section>

      {/* Subscriptions */}
      <section className="space-y-3">
        <h3 className="font-body text-sm font-semibold text-text-primary">
          Subscriptions
          <span className="ml-1.5 font-normal text-text-secondary">
            ({detail.subscriptions.length})
          </span>
        </h3>

        {detail.subscriptions.length > 0 ? (
          detail.subscriptions.map((subscription) => (
            <SubscriptionCard key={subscription.subscriptionId} subscription={subscription} />
          ))
        ) : (
          <div
            className={`rounded-xl border border-dashed ${BORDER} p-8 text-center font-body text-sm text-text-secondary`}
          >
            This subscriber has no subscriptions yet.
          </div>
        )}
      </section>

      <p className="font-body text-xs text-text-secondary">
        Last updated {formatDate(detail.updatedAt)}
      </p>
    </div>
  );
}