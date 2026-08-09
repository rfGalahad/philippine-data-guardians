import { useMemo } from 'react';

import CustomField from '@/components/ui/CustomField';
import CustomDropdown from '@/components/ui/CustomDropdown';
import Button from '@/components/ui/Button';

import { useForm } from '@/hooks/useForm';
import { maxLength, minLength, required } from '@/utils/validators';

import { useFormContext } from '../../../context/FormContext';
import { useAddressOptions, resolveAddressNames } from '@/features/registration/hooks/useAddressOptions';


//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const SECTION_KEY = 'addressDetails';

const INITIAL_VALUES = {
  province: '',
  cityMunicipality: '',
  barangay: '',
  street: '',
  houseNumber: ''
}

const VALIDATION_RULES = {
  province: [required()],
  cityMunicipality: [required()],
  barangay: [required()], 
  street: [minLength(2), maxLength(100)], 
  houseNumber: [minLength(2), maxLength(100)], 
}

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface AddressDetailsProps {
  handleBack: () => void;
  handleNext: () => void;
}

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export const AddressDetails = ({ handleBack, handleNext }: AddressDetailsProps) => {

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
      const resolvedNames = resolveAddressNames(values);

      updateFormData(SECTION_KEY, {
        ...values,       
        ...resolvedNames, 
      });

      handleNext();
    },
  });

  const {
    showMunicipality,
    showBarangay,
    showStreet,
    PROVINCE_OPTIONS,
    FILTERED_MUNICIPALITY_OPTIONS,
    FILTERED_BARANGAY_OPTIONS,
  } = useAddressOptions(form.values);

  return (
      <form onSubmit={form.handleSubmit}>
        <div className="flex flex-col gap-3">
          <CustomDropdown
            id="province"
            label="Province"
            placeholder="e.g. Metro Manila"
            options={PROVINCE_OPTIONS}
            value={form.values.province}
            onChange={form.handleChange}
            error={form.errors.province}
            required
          />

          <CustomDropdown
            id="cityMunicipality"
            label="City / Municipality"
            placeholder="e.g. Makati"
            options={FILTERED_MUNICIPALITY_OPTIONS}
            value={form.values.cityMunicipality}
            onChange={form.handleChange}
            error={form.errors.cityMunicipality}
            disabled={!showMunicipality}
            required
          />

          <CustomDropdown
            id="barangay"
            label="Barangay"
            placeholder="e.g. Bangkal"
            options={FILTERED_BARANGAY_OPTIONS}
            value={form.values.barangay}
            onChange={form.handleChange}
            error={form.errors.barangay}
            disabled={!showBarangay}
            required
          />

          <CustomField
            id="street"
            name="street"
            label='Street / Sitio / Purok / Subdivision'
            placeholder="e.g. 123 St."
            value={form.values.street}
            onChange={form.handleChange}
            error={form.errors.street}
            disabled={!showStreet}
          />
          
          <CustomField
            id="houseNumber"
            name="houseNumber"
            label='House / Unit / Building Number'
            placeholder="e.g. Blk 5 Lot 12"
            value={form.values.houseNumber}
            onChange={form.handleChange}
            error={form.errors.houseNumber}
            disabled={!showStreet}
          />
        </div>

        {/* FORM BUTTONS */}
        <div className="flex flex-col gap-4 mt-6">
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
  );
};

export default AddressDetails;