import { z } from "npm:zod@3";

const name = z.string().trim().min(1).max(100);
const optionalText = (max: number) => z.string().trim().max(max).optional().default("");

export const registrationSchema = z.object({
  // Personal Information
  firstName: name,
  middleName: optionalText(100),
  lastName: name,
  suffix: optionalText(20),
  emailAddress: z.string().trim().toLowerCase().email().max(255),
  contactNumber: z
    .string()
    .trim()
    .max(20)
    .refine((v) => v === "" || v.length >= 7, "Contact number must be at least 7 characters")
    .optional()
    .default(""),

  // Address 
  houseNumber: optionalText(100),
  street: optionalText(150),
  barangay: z.string().trim().min(1).max(150),
  cityMunicipality: z.string().trim().min(1).max(150),
  province: z.string().trim().min(1).max(150),

  // Plan (checked against the plans table by getPlan)
  plan: z.string().trim().min(1).max(100),
});

export type RegistrationValues = z.infer<typeof registrationSchema>;