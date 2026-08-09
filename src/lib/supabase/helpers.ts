import type { Subscriber, Payment, SubscriptionStatus, DigitalIdStatus } from "./types";


export function one<T>(value: T[] | T | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

export function fullName(p: Pick<Subscriber, "first_name" | "middle_name" | "last_name" | "suffix">) {
  return [p.first_name, p.middle_name, p.last_name, p.suffix].filter(Boolean).join(" ");
}

export function latestPayment(payments: Payment[] | null | undefined): Payment | null {
  if (!payments || payments.length === 0) return null;
  return [...payments].sort((a, b) => {
    const at = a.paid_at ? new Date(a.paid_at).getTime() : 0;
    const bt = b.paid_at ? new Date(b.paid_at).getTime() : 0;
    return bt - at;
  })[0];
}

export function computeSubscriptionStatus(startedAt: string, expiresAt: string | null): SubscriptionStatus {
  const now = Date.now();
  const start = new Date(startedAt).getTime();
  if (start > now) return "upcoming";
  if (expiresAt && new Date(expiresAt).getTime() < now) return "expired";
  return "active";
}

export function computeDigitalIdStatus(issuedAt: string | null, expiredAt: string | null): DigitalIdStatus {
  if (!issuedAt) return "not-issued";
  if (expiredAt && new Date(expiredAt).getTime() < Date.now()) return "expired";
  return "issued";
}