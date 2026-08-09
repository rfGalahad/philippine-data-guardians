import { useState } from "react";
import { FormProvider } from "../../context/FormContext";

import PersonalInfo from "./steps/PersonalInfo";
import AddressDetails from "./steps/AddressDetails";
import UploadPicture from "./steps/UploadPicture";
import MembershipPlan from "./steps/MembershipPlan";
import ReviewDetails from "./steps/ReviewDetails";
import PaymentMethod from "./steps/PaymentMethod";

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface AddMemberContentProps {
  onClose: () => void;
}

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

// const STEPS: string[] = [
//   'Consent Form',
//   'Personal Information',
//   'Address Details',
//   'Upload Picture',
//   'Membership Type',
//   'Review'
// ];


//-----------------------------------------------------------
// ADD MEMBER CONTENT FORM
//-----------------------------------------------------------

export const AddMemberContent = ({ onClose }: AddMemberContentProps ) => {

  // const [activeStep, setActiveStep] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  // const handleStepClick = (index: number): void => {
  //   if (index < activeStep) {
  //     setActiveStep(index);
  //     setPage(index + 1);
  //   }
  // };

  const handleBack = (): void => {
    setPage((prev) => Math.max(0, prev -   1));
    // setActiveStep((prev) => Math.max(0, prev - 1));
  };

  const handleNext = (): void => {
    setPage((prev) => prev + 1);
    // setActiveStep((prev) => Math.min(STEPS.length - 1, prev + 1));
  };

  return (
    <div>
      {/* STEPPER */}
      

      {/* FORM CARD */}
      <div className="rounded-lg bg-white">
        <div className="flex flex-col">
          <FormProvider>
            {page === 1 && <PersonalInfo handleNext={handleNext} />}
            {page === 2 && <AddressDetails handleBack={handleBack} handleNext={handleNext} />}
            {page === 3 && <UploadPicture handleBack={handleBack} handleNext={handleNext} />}
            {page === 4 && <MembershipPlan handleBack={handleBack} handleNext={handleNext} />}
            {page === 5 && <PaymentMethod handleBack={handleBack} handleNext={handleNext} />}
            {page === 6 && <ReviewDetails handleBack={handleBack} handleClose={onClose} />}
          </FormProvider>
        </div>
      </div>
    </div>
  )
}

export default AddMemberContent;