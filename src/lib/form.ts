import { createFormHookContexts, createFormHook } from '@tanstack/react-form'

import ComboBox from '@/components/ui/ComboBox'
import TextField from '@/components/ui/TextField'
import ImageUploader from '@/components/ui/ImageUploader'
import RadioGroup from '@/components/ui/RadioGroup'


export const { 
  fieldContext, 
  formContext, 
  useFieldContext, 
  useFormContext 
} = createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { 
    TextField, 
    ComboBox,
    ImageUploader,
    RadioGroup
  },
  formComponents: {},
})
