import { z } from 'zod'

export const updateDetailsSchema = z.object({ 
  subscriberId: z.string().optional(),
  memberId: z.string().optional()
})

export type UpdateDetailsValues = z.infer<typeof updateDetailsSchema>