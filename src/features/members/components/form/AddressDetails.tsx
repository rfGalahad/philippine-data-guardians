import { MapPin } from 'lucide-react';
import { useSelector  } from '@tanstack/react-store';

import Button from '@/components/ui/Button';
import { useAddressOptions } from '@/hooks/useAddressOptions';

import type { AppForm } from '../../hooks/useRegistrationForm';
import { addressDetailsSchema } from '../../schema'; 
import { FormHeader } from './FormHeader';
import { useStepValidation } from '../../hooks/useStepValidation';

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface AddressDetailsProps {
  form: AppForm;
  handleBack: () => void;
  handleNext: () => void;
  hideHeader?: boolean;
  singleColumn?: boolean;
}

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export const AddressDetails = ({ 
  form, 
  handleBack, 
  handleNext,
  hideHeader = false,
  singleColumn = false,
}: AddressDetailsProps ) => {

  const validateStep = useStepValidation(form, addressDetailsSchema);
  
  const provinceId = useSelector(form.store, (state) => state.values.province);
  const municipalityId = useSelector(form.store, (state) => state.values.cityMunicipality);
  
  const { 
    provinceOptions, 
    municipalityOptions, 
    barangayOptions, 
    showMunicipality, 
    showBarangay, 
  } = useAddressOptions({ provinceId, municipalityId });

  const handleSubmit = async (e: React.FormEvent) => {
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
          title="Address Details"
          icon={<MapPin className="text-text-primary" />}
        />
      )}

      <form onSubmit={handleSubmit}>
        <div className={gridClasses}>
          <form.AppField
            name="province"
            validators={{ onChange: addressDetailsSchema.shape.province }}
            listeners={{
              onChange: () => {
                form.setFieldValue('cityMunicipality', '');
                form.setFieldValue('barangay', '');
              },
            }}
          >
            {(field) => (
              <field.ComboBox
                label="Province"
                placeholder="e.g. Metro Manila"
                options={provinceOptions}
                required
              />
            )}
          </form.AppField>

          <form.AppField
            name="cityMunicipality"
            validators={{ onSubmit: addressDetailsSchema.shape.cityMunicipality }}
            listeners={{
              onChange: () => {
                form.setFieldValue('barangay', '');
              },
            }}
          >
            {(field) => (
              <field.ComboBox
                label="City / Municipality"
                placeholder="e.g. Makati"
                options={municipalityOptions}
                disabled={!showMunicipality}
                required
              />
            )}
          </form.AppField>

          <form.AppField
            name="barangay"
            validators={{ onSubmit: addressDetailsSchema.shape.barangay }}
          >
            {(field) => (
              <field.ComboBox
                label="Barangay"
                placeholder="e.g. Bangkal"
                options={barangayOptions}
                disabled={!showBarangay}
                required
              />
            )}
          </form.AppField>

          <form.AppField
            name="street"
            validators={{ onChange: addressDetailsSchema.shape.street }}
          >
            {(field) => (
              <field.TextField
                label="Street / Sitio / Purok / Subdivision"
                placeholder="e.g. 123 St."
                disabled={!showBarangay}
              />
            )}
          </form.AppField>

          <form.AppField
            name="houseNumber"
            validators={{ onChange: addressDetailsSchema.shape.houseNumber }}
          >
            {(field) => (
              <field.TextField
                label="House / Unit / Building Number"
                placeholder="e.g. Blk 5 Lot 12"
                disabled={!showBarangay}
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

export default AddressDetails;