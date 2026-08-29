import { z } from 'zod'

export const addressDetailsSchema = z.object({
  province: z.string().min(1, "Province is required"),
  cityMunicipality: z.string().min(1, "City/Municipality is required"),
  barangay: z.string().min(1, "Barangay is required"),
  street: z.string(),
  houseNumber: z.string(),
})

export type AddressDetailsValues = z.infer<typeof addressDetailsSchema>