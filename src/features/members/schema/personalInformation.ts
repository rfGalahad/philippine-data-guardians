import { z } from 'zod'

export const personalInformationSchema = z.object({ 
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string(),
  lastName: z.string().min(1, "Last name is required"),
  suffix: z.string(),
  emailAddress: z.string().email("Invalid email"),
  contactNumber: z
    .string()
    .optional()
    .refine( 
      (val) => !val || /^09\d{9}$/.test(val),
      { message: "Invalid contact number" },
    ),
})

export type PersonalInformationValues = z.infer<typeof personalInformationSchema>