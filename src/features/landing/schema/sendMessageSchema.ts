import { z } from 'zod'

export const sendMessageSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  emailAddress: z
    .string()
    .trim()
    .min(1, 'Email address is required')
    .email('Enter a valid email address'),
  message: z
    .string()
    .min(20, 'Message must be at least 20 characters')
    .max(500, 'Message must be 500 characters or fewer'),
  // Honeypot — not user-facing, just carried in form state
  botField: z.string(),
})

export type SendMessageFormValues = z.infer<typeof sendMessageSchema>

export const sendMessageDefaultValues: SendMessageFormValues = {
  fullName: '',
  emailAddress: '',
  message: '',
  botField: '',
}