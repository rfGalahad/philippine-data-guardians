import { toNumber } from "@/utils/number";

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------


export interface Payment {
  paymentId: string;
  referenceNumber: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  paidAt: string | null;
  renewalCount: number;
}

export interface PaymentRow {
  payment_id: string;
  reference_number: string;
  amount: number | string;
  payment_method: string;
  payment_status: string;
  paid_at: string | null;
  renewal_count: number | null;
}

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

const COUNTED_STATUSES = new Set(["paid", "completed", "success", "succeeded"]);
 
export const isCountedPayment = (payment: Payment): boolean =>
  COUNTED_STATUSES.has(payment.paymentStatus.toLowerCase());

export function mapPayment(row: PaymentRow): Payment {
  return {
    paymentId: row.payment_id,
    referenceNumber: row.reference_number,
    amount: toNumber(row.amount),
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    paidAt: row.paid_at,
    renewalCount: row.renewal_count ?? 0,
  };
}