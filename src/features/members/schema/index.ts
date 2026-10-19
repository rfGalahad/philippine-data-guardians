import { z } from "zod";

import { updateDetailsSchema } from "./updateDetails";
import { personalInformationSchema } from './personalInformation'
import { addressDetailsSchema } from './addressDetails'
import { uploadPictureSchema } from './uploadPicture'
import { membershipPlanSchema } from './membershipPlan'
import { paymentSchema } from './payment'

export * from './updateDetails'
export * from './personalInformation'
export * from './addressDetails'
export * from './uploadPicture'
export * from './membershipPlan'
export * from './payment' 

export const fullSchema = personalInformationSchema
  .merge(updateDetailsSchema)
  .merge(addressDetailsSchema)
  .merge(uploadPictureSchema)
  .merge(membershipPlanSchema)
  .merge(paymentSchema)

export type RegistrationValues = z.infer<typeof fullSchema>