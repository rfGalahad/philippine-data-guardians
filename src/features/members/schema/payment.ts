import { z } from 'zod'
import type { PaymentMethod } from '@/lib/supabase/types'


export const paymentSchema = z.object({
  method: z.custom<PaymentMethod>().nullable(),
  referenceNumber: z.string().min(1, "Reference Number is required"),
})

export type PaymentValues = z.infer<typeof paymentSchema>