import { useMemo } from 'react';

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

import { useFormContext } from '../../../context/FormContext';


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
  handleNext: () => void;
}

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export const PersonalInfo = ({ handleNext }: PersonalInfoProps) => {

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
    <form onSubmit={form.handleSubmit}>
      <div className="flex flex-col gap-3">
        {/* Name group */}
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

        <hr className="my-5 border-t border-[rgba(5,50,97,0.08)]" />

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

        {/* FORM BUTTONS */}
        <Button
          label="Next Step"
          color="neutral"
          type="submit"
          fullWidth
          className='mt-4'
        />
      </div>
    </form>
  );
};

export default PersonalInfo;