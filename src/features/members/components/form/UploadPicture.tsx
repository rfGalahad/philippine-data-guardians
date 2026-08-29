import type { FormEvent } from 'react';
import { Camera } from 'lucide-react';

import Button from '@/components/ui/Button';

import type { AppForm } from '../../hooks/useRegistrationForm';
import { useStepValidation } from '../../hooks/useStepValidation';
import { uploadPictureSchema } from '../../schema';
import { FormHeader } from './FormHeader';

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface UploadPictureProps {
  form: AppForm;
  handleBack: () => void;
  handleNext: () => void;
  hideHeader?: boolean;
  singleColumn?: boolean;
}

//-----------------------------------------------------------
// UPLOAD PICTURE
//-----------------------------------------------------------

export const UploadPicture = ({
  form,
  handleBack,
  handleNext,
  hideHeader = false,
  singleColumn = false,
}: UploadPictureProps) => {

  const validateStep = useStepValidation(form, uploadPictureSchema);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isValid = await validateStep();
    if (isValid) handleNext();
  };

  return (
    <div className="flex flex-col">
      {!hideHeader && (
        <FormHeader
          title="Upload Picture"
          icon={<Camera className="h-6 w-6 text-text-primary" />}
        />
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className={singleColumn ? '' : 'p-6'}>
          <form.AppField
            name="uploadPicture"
            validators={{ onChange: uploadPictureSchema.shape.uploadPicture }}
          >
            {(field) => (
              <field.ImageUploader
                label=""
                helperText="PNG, JPG or WEBP (max 5MB)"
              />
            )}
          </form.AppField>
        </div>

        <div
          className={
            singleColumn
              ? 'flex flex-col sm:flex-row gap-2 sm:gap-4 w-full mt-6'
              : 'flex flex-col sm:flex-row gap-2 sm:gap-4 w-full border-t rounded-b-2xl p-6 border-gray-200 bg-gray-50'
          }
        >
          <Button
            label="Previous Step"
            variant="outlined"
            color="white"
            type="button"
            onClick={handleBack}
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

export default UploadPicture;