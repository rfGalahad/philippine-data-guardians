// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

export type DigitalIdStatus = "issued" | "expired" | "not-issued";

export interface DigitalIdRow {
  issued_at: string | null;
  expired_at: string | null;
}