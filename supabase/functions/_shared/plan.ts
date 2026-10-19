import { supabaseAdmin } from "./supabaseAdmin.ts";

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

export type PlanName = "student_academic" | "professional";

export interface PlanInfo {
  plan_id: string;
  service_id: string;
  price: number;
}

// ---------------------------------------------------------------------------
// QUERIES
// ---------------------------------------------------------------------------

// RETURNS: PLAN_ID, SERVICE_ID, PRICE
export async function getPlan(planName: string): Promise<PlanInfo> {
  const { data, error } = await supabaseAdmin
    .from("plans")
    .select("plan_id, service_id, price")
    .eq("plan_name", planName)
    .single();

  if (error) throw error;
  if (!data) throw new Error(`No plan found for tier "${planName}"`);
  return data;
}