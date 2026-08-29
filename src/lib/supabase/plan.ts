import { supabase } from '@/lib/supabase/client';

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

export interface PlanInfo {
  plan_id: string;
  service_id: string;
  price: number;
}

// ---------------------------------------------------------------------------
// QUERIES
// ---------------------------------------------------------------------------

// GET SERVICE NAME, PLAN NAME, & PRICE  
// RETURNS: PLAN_ID, SERVICE_ID, PRICE
export async function getPlan(planName: string): Promise<PlanInfo> {
  const { data, error } = await supabase
    .from('plans')
    .select('plan_id, service_id, price')
    .eq('plan_name', planName)
    .single();

  if (error) throw error;
  if (!data) throw new Error(`No plan found for tier "${planName}"`);
  return data;
}