import { useAppForm } from '@/lib/form';
import { fullSchema, type RegistrationValues } from '../schema';


const DEFAULT_VALUES: RegistrationValues = {
  firstName: '',
  middleName: '',
  lastName: '',
  suffix: '',
  emailAddress: '',
  contactNumber: '',

  province: '',
  cityMunicipality: '',
  barangay: '',
  street: '',
  houseNumber: '',

  oldPhotoUrl: '',
  uploadPicture: null,

  plan: null,
  cost: 0,

  method: null,
  referenceNumber: ''
}

export function useRegistrationForm(initialValues?: Partial<RegistrationValues>) {
  return useAppForm({
    defaultValues: { ...DEFAULT_VALUES, ...initialValues },
    validators: { onSubmit: fullSchema },
  });
}

export type AppForm = ReturnType<typeof useRegistrationForm>;