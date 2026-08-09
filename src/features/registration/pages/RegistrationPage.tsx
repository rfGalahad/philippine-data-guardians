import { useState } from 'react';

import BackgroundImage from '@/assets/pdg-background.png';

import { FormProvider } from '../context/FormContext';
import RegistrationStepper from '../components/RegistrationStepper';
import PrivacyPolicyNotice from '../components/PrivacyPolicyNotice';
import PersonalInfo from '../components/PersonalInfo';
import AddressDetails from '../components/AddressDetails';
import UploadPicture from '../components/UploadPicture';
import MembershipTier from '../components/MembershipTier';
import Review from '../components/Review';

const STEPS: string[] = [
  'Consent Form',
  'Personal Information',
  'Address Details',
  'Upload Picture',
  'Membership Type',
  'Review'
];


export const RegistrationPage = () => {
  
  const [activeStep, setActiveStep] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  const handleStepClick = (index: number): void => {
    if (index < activeStep) {
      setActiveStep(index);
      setPage(index + 1);
    }
  };

  const handleBack = (): void => {
    setPage((prev) => Math.max(0, prev - 1));
    setActiveStep((prev) => Math.max(0, prev - 1));
  };

  const handleNext = (): void => {
    setPage((prev) => prev + 1);
    setActiveStep((prev) => Math.min(STEPS.length - 1, prev + 1));
  };

  return (
    <div
      className="relative flex min-h-screen flex-col items-center py-8 md:py-14 text-white bg-center bg-cover bg-fixed"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >

      <div className="relative z-10 w-full max-w-6xl px-4 sm:px-6 md:px-8">
        {/* STEPPER */}
        <RegistrationStepper
          steps={STEPS}
          activeStep={activeStep}
          onStepClick={handleStepClick}
        />

        {/* FORM CARD */}
        <div className="rounded-lg bg-white">
          <div className="flex flex-col">
            <FormProvider>
              {page === 1 && <PrivacyPolicyNotice handleNext={handleNext} />}
              {page === 2 && <PersonalInfo handleBack={handleBack} handleNext={handleNext} />}
              {page === 3 && <AddressDetails handleBack={handleBack} handleNext={handleNext} />}
              {page === 4 && <UploadPicture handleBack={handleBack} handleNext={handleNext} />}
              {page === 5 && <MembershipTier handleBack={handleBack} handleNext={handleNext} />}
              {page === 6 && <Review handleBack={handleBack} />}
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;