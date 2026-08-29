import { 
  useRegistrationForm,
  useStepper,
  useUpdateMember
} from "@/features/members/";

import {
  PersonalInformation,
  AddressDetails,
  UploadPicture,
  MembershipPlan,
  PaymentMethod,
  ReviewDetails
} from "../form";

import RegistrationStepper from "../form/RegistrationStepper";
import { useEffect, useRef } from "react";
import type { MemberDetail } from "@/lib/supabase/members";
import { mapMemberDetailToFormValues } from "../../utils/map";


//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface UpdateMemberContentProps {
  detail: MemberDetail;
  onClose: () => void;
  onSuccess: () => void;
}

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const STEPS: string[] = [
  "Personal Info",
  "Address",
  "Upload Picture",
  "Membership",
  "Payment",
  "Review",
];

//-----------------------------------------------------------
// ADD MEMBER CONTENT FORM
//-----------------------------------------------------------

export const UpdateMemberContent = ({ 
  detail,
  onClose,
  onSuccess
}: UpdateMemberContentProps ) => {

  const form = useRegistrationForm(mapMemberDetailToFormValues(detail));
  const values = form.state.values;

  const { update, isUpdating } = useUpdateMember(detail.memberId, onSuccess);

  const { 
    activeStep, 
    page, 
    handleStepClick, 
    handleBack, 
    handleNext 
  } = useStepper(STEPS.length);

  // Fill the form whenever a (new) detail comes in
  const resetForId = useRef<string | null>(null);
  useEffect(() => {
    if (detail && resetForId.current !== detail.memberId) {
      const mapped = mapMemberDetailToFormValues(detail);
      form.reset(mapped);
      resetForId.current = detail.memberId;
    }
  }, [detail, form]);

  const handleUpdateMember = async () => {
    const plan = values.plan;
    if (!plan) return;
    try {
      await update({ values, plan });
      onClose();
    } catch {
      // error toast already shown in the hook; keep the panel open
    }
  };

  return (
    <div className="pt-4">
      {/* STEPPER */}
      <RegistrationStepper 
        steps={STEPS} 
        activeStep={activeStep} 
        onStepClick={handleStepClick} 
      />

      {/* FORM CARD */}
      <div className="rounded-lg bg-white">
        <div className="flex flex-col">
          {page === 1 && (
            <PersonalInformation 
              form={form} 
              handleBack={handleBack} 
              handleNext={handleNext} 
              hideHeader={true}
              singleColumn={true}
            />
          )}

          {page === 2 && (
            <AddressDetails 
              form={form} 
              handleBack={handleBack} 
              handleNext={handleNext} 
              hideHeader={true}
              singleColumn={true}
            />
          )}

          {page === 3 && (
            <UploadPicture 
              form={form} 
              handleBack={handleBack} 
              handleNext={handleNext} 
              hideHeader={true}
              singleColumn={true}
            />
          )}

          {page === 4 && (
            <MembershipPlan 
              form={form} 
              handleBack={handleBack} 
              handleNext={handleNext} 
              hideHeader={true}
              singleColumn={true}
            />
          )}

          {page === 5 && (
            <PaymentMethod 
              form={form} 
              handleBack={handleBack} 
              handleNext={handleNext} 
              singleColumn={true}
            />
          )}

          {page === 6 && (
            <ReviewDetails 
              form={form} 
              handleBack={handleBack} 
              isProcessing={isUpdating} 
              onCheckout={handleUpdateMember} 
              hideHeader={true}
              singleColumn={true}
              updateMemberMode={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateMemberContent;