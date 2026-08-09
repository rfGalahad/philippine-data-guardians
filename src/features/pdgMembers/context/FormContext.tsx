import { type ReactNode, createContext, useContext, useState } from 'react';
import type { TierName } from '@/features/registration/components/MembershipTier/MembershipTierCard';
import type { PaymentMethod } from '@/lib/supabase/types';

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

export type FormSection = keyof FormData;

export interface PersonalInfo {
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  emailAddress: string;
  contactNumber: string;
}

interface AddressDetails {
  province: string;
  provinceName: string;        
  cityMunicipality: string;
  cityMunicipalityName: string; 
  barangay: string;
  barangayName: string;         
  street: string;
  houseNumber: string;
  municipality?: string; 
}

interface MembershipPlan {
  plan: TierName | null;
  cost: string;        
}

interface Payment {
  method: PaymentMethod;
  referenceNumber: string;
}

export interface FormData {
  personalInfo: PersonalInfo;
  addressDetails: AddressDetails;
  uploadPicture: File | string | null;
  membershipPlan: MembershipPlan;
  payment: Payment;
}

interface FormContextValue {
  formData: FormData;
  updateFormData: <K extends FormSection>(section: K, data: FormData[K]) => void;
  clearFormData: () => void;
}

interface FormProviderProps {
  children: ReactNode;
}

//-----------------------------------------------------------
// CONTEXT
//-----------------------------------------------------------

const FormContext = createContext<FormContextValue | undefined>(undefined);

//-----------------------------------------------------------
// INITIAL FORM
//-----------------------------------------------------------

const initialFormData: FormData = {
  personalInfo: { 
    firstName: '', 
    lastName: '', 
    emailAddress: '', 
    contactNumber: '' 
  },
  addressDetails: { 
    province: '',
    provinceName: '',        
    cityMunicipality: '',
    cityMunicipalityName: '', 
    barangay: '',
    barangayName: '',         
    street: '',
    houseNumber: '',
    municipality: '', 
  },
  uploadPicture: null,
  membershipPlan: { plan: null, cost: '' },
  payment: { 
    method: 'qr',
    referenceNumber: '' 
  }
};


//-----------------------------------------------------------
// PROVIDER
//-----------------------------------------------------------

export const FormProvider = ({ children }: FormProviderProps) => {

  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updateFormData = <K extends FormSection>(section: K, data: FormData[K]): void => {
    setFormData((prev) => ({ ...prev, [section]: data }));
  };

  const clearFormData = () => {
    setFormData(initialFormData);
  }

  return (
    <FormContext.Provider value={{ formData, updateFormData, clearFormData }}>
      {children}
    </FormContext.Provider>
  );
};

//-----------------------------------------------------------
// CUSTOM HOOK
//-----------------------------------------------------------

export const useFormContext = (): FormContextValue => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};