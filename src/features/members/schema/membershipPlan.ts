import { z } from 'zod'
import type { PlanName } from '@/lib/supabase/types'


export const membershipPlanSchema = z.object({
  plan: z.custom<PlanName>().nullable(),
  cost: z.number(),
})

export type PersonalInfoValues = z.infer<typeof membershipPlanSchema>