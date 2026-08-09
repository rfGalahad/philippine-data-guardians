import { useMemo } from 'react';

import CustomField from '@/components/ui/CustomField';
import RadioGroup from '@/components/CustomRadio';
import Button from '@/components/ui/Button';

import { useForm } from '@/hooks/useForm';
import { minLength, required } from '@/utils/validators';

import { useFormContext } from '../../../context/FormContext';


//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const SECTION_KEY = 'payment';

const INITIAL_VALUES = {
  method: "",
  referenceNumber: ""
}

const VALIDATION_RULES = {
  method: [required()],
  referenceNumber: [required(), minLength(2)]
}

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface PaymentMethodProps {
  handleBack: () => void;
  handleNext: () => void;
}

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export const PaymentMethod = ({ 
  handleBack,
  handleNext 
}: PaymentMethodProps ) => {

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
      updateFormData(SECTION_KEY, values);
      handleNext();
    },
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <div className="flex flex-col gap-3">
        {/* PAYMENT METHOD */}
        <RadioGroup
          name="method"
          legend="Choose a payment method"
          value={form.values.method}
          onChange={form.handleChange}
          error={form.errors.method}
          options={[
            {
              value: "qr",
              label: "QR",
              hint: "Scan the QR code to pay"
            },
            {
              value: "cash",
              label: "Cash",
              hint: "Pay directly to the administrator"
            },
          ]}
        />

        {/* REFERENCE NUMBER */}
        {form.values.method && (
          <CustomField
            id="referenceNumber"
            name="referenceNumber"
            label="Email Address"
            placeholder="e.g. 123789-123989-31789"
            value={form.values.referenceNumber}
            onChange={form.handleChange}
            error={form.errors.referenceNumber}
          />
        )}
        
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
      </div>
    </form>
  );
};

export default PaymentMethod;