import { type SubmitEvent } from 'react';

import Button from '@/components/ui/Button';

import type { AppForm } from '../../hooks/useRegistrationForm';
import { useStepValidation } from '../../hooks/useStepValidation';
import { paymentSchema } from '../../schema';

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface PaymentMethodProps {
  form: AppForm
  handleBack: () => void;
  handleNext: () => void;
  singleColumn?: boolean;
}

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export const PaymentMethod = ({ 
  form,
  handleBack,
  handleNext,
  singleColumn = false,
}: PaymentMethodProps ) => {

  const validateStep = useStepValidation(form, paymentSchema);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isValid = await validateStep();
    if (isValid) handleNext();
  };

  return (
    <div className="flex flex-col gap-3">
      {/* PAYMENT METHOD */}

      <form onSubmit={handleSubmit} noValidate>
        <div className={singleColumn ? 'flex flex-col gap-4' : 'p-6'}>
          <form.AppField
            name="method"
            validators={{ onChange: paymentSchema.shape.method }}
          >
            {(field) => (
              <field.RadioGroup
                legend="Membership Plan"
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
            )}
          </form.AppField>

          <form.AppField
            name="referenceNumber"
            validators={{ onChange: paymentSchema.shape.referenceNumber }}
          >
            {(field) => (
              <field.TextField 
                label="Reference Number" 
                placeholder="e.g. 123789-123989-31789" 
                required 
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

export default PaymentMethod;