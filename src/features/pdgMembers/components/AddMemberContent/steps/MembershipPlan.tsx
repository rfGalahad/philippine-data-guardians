import { useMemo } from 'react';
import type { ChangeEvent } from 'react';

import RadioGroup from '@/components/CustomRadio';
import Button from '@/components/ui/Button';

import { useForm } from '@/hooks/useForm';
import { required } from '@/utils/validators';
import type { TierName } from '@/features/registration/components/MembershipTier/MembershipTierCard';

import { useFormContext } from '../../../context/FormContext';


//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const SECTION_KEY = 'membershipPlan';

const INITIAL_VALUES = {
  plan: null as TierName | null,
  cost: ""
}

const VALIDATION_RULES = {
  plan: [required()]
}

const PLAN_COSTS: Record<TierName, string> = {
  'Student/Academe': "300",
  'Professionals': "500",
};

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface MembershipPlanProps {
  handleBack: () => void;
  handleNext: () => void;
}

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export const MembershipPlan = ({ 
  handleBack,
  handleNext 
}: MembershipPlanProps ) => {

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

  const handlePlanChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedPlan = e.target.value as TierName;
    form.setValue('plan', selectedPlan);
    form.setValue('cost', PLAN_COSTS[selectedPlan] ?? "");
  };

  return (
    <form onSubmit={form.handleSubmit}>
      <div className="flex flex-col gap-3">
        {/* Name group */}
        <RadioGroup
          name="plan"
          legend="Choose a plan"
          value={form.values.plan ?? ""}
          onChange={handlePlanChange}
          error={form.errors.plan}
          options={[
            { 
              value: "Student/Academe", 
              label: "Student/Academy", 
              hint: "₱300/year — for students" 
            },
            { 
              value: "Professionals", 
              label: "Professionals", 
              hint: "₱500/year — for professionals" 
            },
          ]}
        />

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

export default MembershipPlan;