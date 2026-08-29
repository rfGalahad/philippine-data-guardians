import { z } from 'zod'

export const uploadPictureSchema = z.object({
  oldPhotoUrl: z.string(),
  uploadPicture: z.union([z.string(), z.instanceof(File)]).nullable(),

})

export type UploadPictureValues = z.infer<typeof uploadPictureSchema>