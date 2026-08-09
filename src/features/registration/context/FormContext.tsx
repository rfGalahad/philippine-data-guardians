import { type ReactNode, createContext, useContext, useState } from 'react';
import type { TierName } from '../components/MembershipTier/MembershipTierCard';

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

interface MembershipType {
  tier: TierName | null;
  cost: string;        
}

export interface FormData {
  personalInfo: PersonalInfo;
  addressDetails: AddressDetails;
  uploadPicture: File | string | null;
  membershipType: MembershipType;
}

interface FormContextValue {
  formData: FormData;
  updateFormData: <K extends FormSection>(section: K, data: FormData[K]) => void;
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
  membershipType: { tier: null, cost: '' },
};


//-----------------------------------------------------------
// PROVIDER
//-----------------------------------------------------------

export const FormProvider = ({ children }: FormProviderProps) => {

  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updateFormData = <K extends FormSection>(section: K, data: FormData[K]): void => {
    setFormData((prev) => ({ ...prev, [section]: data }));
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData }}>
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