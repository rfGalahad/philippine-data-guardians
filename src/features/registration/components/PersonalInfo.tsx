import { User } from 'lucide-react';

import CustomField from '@/components/ui/CustomField';
import CustomDropdown from '@/components/ui/CustomDropdown';
import Button from '@/components/ui/Button';

import { SUFFIX_OPTIONS } from '@/constants/options';
import { useForm } from '@/hooks/useForm';
import { 
  email, 
  maxLength, 
  minLength, 
  required, 
  phonePH 
} from '@/utils/validators';

import { useFormContext } from '../context/FormContext';
import { FormHeader } from './FormHeader';
import { useMemo } from 'react';


//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const SECTION_KEY = 'personalInfo';

const INITIAL_VALUES = {
  firstName: '',
  middleName: '',
  lastName: '',
  suffix: '',
  emailAddress: '',
  contactNumber: ''
}

const VALIDATION_RULES = {
  firstName: [required(), minLength(2), maxLength(50)],
  middleName: [minLength(2), maxLength(50)],
  lastName: [required(), minLength(2), maxLength(50)], 
  emailAddress: [required(), email(), maxLength(100)], 
  contactNumber: [phonePH()]
}

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface PersonalInfoProps {
  handleBack: () => void;
  handleNext: () => void;
}

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export const PersonalInfo = ({ handleBack, handleNext }: PersonalInfoProps) => {

  const { formData, updateFormData } = useFormContext();

  const initialValues = useMemo(
    () => ({
      ...INITIAL_VALUES,
      ...formData[SECTION_KEY],
    }),
    [formData]
  );

  const form = useForm({
    initialValues: initialValues,
    validationRules: VALIDATION_RULES,
    onSubmit: async (values) => {
      updateFormData(SECTION_KEY, values)
      handleNext();
    },
  });

  return (
    <div className="flex flex-col">
      {/* FORM HEADER */}
      <FormHeader
        title="Personal Information"
        icon={<User className="text-[#053261]" />}
      />

      {/* FORM CONTENT */}
      <form onSubmit={form.handleSubmit}>
        <div className="flex flex-col p-6">
          {/* Name group */}
          <div className="mb-2">
            <span className="mb-3 block text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[rgba(5,50,97,0.45)]">
              Full Name
            </span>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              <CustomField
                id="firstName"
                name="firstName"
                label="First Name"
                placeholder="e.g. Juan"
                value={form.values.firstName}
                onChange={form.handleChange}
                error={form.errors.firstName}
              />

              <CustomField
                id="middleName"
                name="middleName"
                label="Middle Name"
                placeholder="e.g. Santos"
                value={form.values.middleName}
                onChange={form.handleChange}
                error={form.errors.middleName}
              />
              
              <CustomField
                id="lastName"
                name="lastName"
                label="Last Name"
                placeholder="e.g. Dela Cruz"
                value={form.values.lastName}
                onChange={form.handleChange}
                error={form.errors.lastName}
              />

              <CustomDropdown
                id="suffix"
                label="Suffix"
                placeholder="e.g. Jr."
                options={SUFFIX_OPTIONS}
                value={form.values.suffix}
                onChange={form.handleChange}
                error={form.errors.suffix}
                required
              />
            </div>
          </div>

          <hr className="my-5 border-t border-[rgba(5,50,97,0.08)]" />

          {/* Contact group */}
          <div>
            <span className="mb-3 block text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[rgba(5,50,97,0.45)]">
              Contact Details
            </span>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              <CustomField
                id="emailAddress"
                name="emailAddress"
                label="Email Address"
                placeholder="sample@email.com"
                value={form.values.emailAddress}
                onChange={form.handleChange}
                error={form.errors.emailAddress}
              />
              <CustomField
                id="contactNumber"
                name="contactNumber"
                label="Contact Number"
                placeholder="+63 XXX XXX XXXX"
                value={form.values.contactNumber}
                onChange={form.handleChange}
                error={form.errors.contactNumber}
              />
            </div>
          </div>
        </div>

        {/* FORM BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full border-t rounded-b-2xl p-6 border-gray-200 bg-gray-50">
          <Button
            label="Go Back to Consent Form"
            variant="outlined"
            color="white"
            onClick={() => handleBack()}
            fullWidth
          />
          <Button
            label="Next Step"
            color="neutral"
            type="submit"
            fullWidth
          />
        </div>
      </form>
    </div>
  );
};

export default PersonalInfo;