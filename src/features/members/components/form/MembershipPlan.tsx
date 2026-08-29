import type { FormEvent } from 'react';
import { GraduationCap } from 'lucide-react';

import Button from '@/components/ui/Button';

import type { AppForm } from '../../hooks/useRegistrationForm';
import { useStepValidation } from '../../hooks/useStepValidation';
import { membershipPlanSchema } from '../../schema';
import { FormHeader } from './FormHeader';

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface MembershipPlanProps {
  form: AppForm;
  handleBack: () => void;
  handleNext: () => void;
  hideHeader?: boolean;
  singleColumn?: boolean;
}

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const PLAN_COSTS: Record<string, number> = {
  student_academic: 300,
  professional: 500,
};

//-----------------------------------------------------------
// MEMBERSHIP PLAN
//-----------------------------------------------------------

export const MembershipPlan = ({
  form,
  handleBack,
  handleNext,
  hideHeader = false,
  singleColumn = false,
}: MembershipPlanProps) => {

  const validateStep = useStepValidation(form, membershipPlanSchema);

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
          title="Membership Plan"
          icon={<GraduationCap className="h-6 w-6 text-text-primary" />}
        />
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className={singleColumn ? '' : 'p-6'}>
          <form.AppField
            name="plan"
            validators={{ onChange: membershipPlanSchema.shape.plan }}
            listeners={{
              onChange: ({ value }) => {
                if (value == null) return;
                form.setFieldValue('cost', PLAN_COSTS[value] ?? 0);
              },
            }}
          >
            {(field) => (
              <field.RadioGroup
                legend="Membership Plan"
                options={[
                  {
                    value: "student_academic",
                    label: "Student/Academy",
                    hint: "₱300/year — for students",
                  },
                  {
                    value: "professional",
                    label: "Professionals",
                    hint: "₱500/year — for professionals",
                  },
                ]}
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

export default MembershipPlan;