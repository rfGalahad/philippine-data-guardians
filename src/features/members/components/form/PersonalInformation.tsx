import type { FormEvent } from 'react';
import { User } from 'lucide-react';

import Button from '@/components/ui/Button';
import { SUFFIX_OPTIONS } from '@/constants/options';

import type { AppForm } from '../../hooks/useRegistrationForm';
import { useStepValidation } from '../../hooks/useStepValidation';
import { personalInformationSchema } from '../../schema';
import { FormHeader } from './FormHeader';

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface PersonalInfoProps {
  form: AppForm;
  handleBack: () => void;
  handleNext: () => void;
  hideHeader?: boolean;
  singleColumn?: boolean;
}

//-----------------------------------------------------------
// PERSONAL INFORMATION FORM
//-----------------------------------------------------------

export const PersonalInformation = ({
  form,
  handleBack,
  handleNext,
  hideHeader = false,
  singleColumn = false,
}: PersonalInfoProps) => {
  
  const validateStep = useStepValidation(form, personalInformationSchema);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isValid = await validateStep();
    if (isValid) handleNext();
  };

  const gridClasses = singleColumn
    ? 'grid grid-cols-1 gap-4'
    : 'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 p-6';

  return (
    <div className="flex flex-col">
      {!hideHeader && (
        <FormHeader
          title="Personal Information"
          icon={<User className="text-text-primary" />}
        />
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col">
          <div className={gridClasses}>
            <form.AppField
              name="firstName"
              validators={{ onChange: personalInformationSchema.shape.firstName }}
            >
              {(field) => (
                <field.TextField 
                  label="First Name" 
                  placeholder="e.g. Juan" 
                  required 
                />
              )}
            </form.AppField>

            <form.AppField name="middleName">
              {(field) => (
                <field.TextField 
                  label="Middle Name" 
                  placeholder="e.g. Santos" 
                />
              )}
            </form.AppField>

            <form.AppField
              name="lastName"
              validators={{ onChange: personalInformationSchema.shape.lastName }}
            >
              {(field) => (
                <field.TextField 
                  label="Last Name" 
                  placeholder="e.g. Dela Cruz" 
                  required 
                />
              )}
            </form.AppField>

            <form.AppField name="suffix">
              {(field) => (
                <field.ComboBox
                  label="Suffix"
                  placeholder="e.g. Jr."
                  options={SUFFIX_OPTIONS}
                />
              )}
            </form.AppField>
          </div>

          <hr className="my-5 border-t border-[rgba(5,50,97,0.08)]" />

          <div className={gridClasses}>
            <form.AppField
              name="emailAddress"
              validators={{ onSubmit: personalInformationSchema.shape.emailAddress }}
            >
              {(field) => (
                <field.TextField
                  label="Email Address"
                  placeholder="sample@email.com"
                  required
                />
              )}
            </form.AppField>

            <form.AppField
              name="contactNumber"
              validators={{ onSubmit: personalInformationSchema.shape.contactNumber }}
            >
              {(field) => (
                <field.TextField
                  label="Contact Number"
                  placeholder="e.g. 09234567890"
                />
              )}
            </form.AppField>
          </div>
        </div>

        <div
          className={
            singleColumn
              ? 'flex flex-col sm:flex-row gap-2 sm:gap-4 w-full mt-6'
              : 'flex flex-col sm:flex-row gap-2 sm:gap-4 w-full border-t rounded-b-2xl p-6 border-gray-200 bg-gray-50'
          }
        >
          {!singleColumn && (
            <Button
              label="Go Back to Consent Form"
              variant="outlined"
              color="white"
              onClick={() => handleBack()}
              fullWidth
            />
          )}
          <Button label="Next Step" color="neutral" type="submit" fullWidth />
        </div>
      </form>
    </div>
  );
};

export default PersonalInformation;