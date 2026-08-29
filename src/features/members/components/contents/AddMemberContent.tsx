import { 
  useRegistrationForm,
  useStepper,
  useRegisterMember
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


//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface AddMemberContentProps {
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

export const AddMemberContent = ({ 
  onClose, 
  onSuccess
}: AddMemberContentProps) => {

  const form = useRegistrationForm();
  const values = form.state.values;

  const { register, loading } = useRegisterMember(onSuccess);

  const { 
    activeStep, 
    page, 
    handleStepClick, 
    handleBack, 
    handleNext 
  } = useStepper(STEPS.length);

  const handleAddMember = async () => {
    if (!values.plan) return;
    try {
      await register(values, values.plan);
      onClose();
    } catch {
      // error toast already shown in the hook; keep the modal open
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
              isProcessing={loading} 
              onCheckout={handleAddMember} 
              hideHeader={true}
              singleColumn={true}
              addMemberMode={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMemberContent;