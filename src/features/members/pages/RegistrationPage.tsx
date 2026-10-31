import BackgroundImage from '@/assets/pdg-background.png';

import RegistrationStepper from '../components/form/RegistrationStepper';
import PrivacyPolicyNotice from '../components/form/PrivacyPolicyNotice';
import PersonalInformation from '../components/form/PersonalInformation';
import AddressDetails from '../components/form/AddressDetails';
import UploadPicture from '../components/form/UploadPicture';
import useStepper from '../hooks/useStepper';

import { useRegistrationForm } from '../hooks/useRegistrationForm';
import MembershipPlan from '../components/form/MembershipPlan';
import Review from '../components/form/ReviewDetails';

import { useRegisterAndCheckout } from '../hooks/useRegisterAndCheckout';
import { RenewMembershipDialog } from '../components/RenewMembershipDialog';
import { VerifyEmailDialog } from '../components/VerifyEmailDialog';

// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------

const STEPS: string[] = [
  'Consent Form',
  'Personal Information',
  'Address Details',
  'Upload Picture',
  'Membership Type',  
  'Review'
];

// ---------------------------------------------------------------------------
// REGISTRATION PAGE
// ---------------------------------------------------------------------------

export const RegistrationPage = () => {

  const form = useRegistrationForm();
  
  const {
    checkout, 
    loading, 
    step, 
    expiresAt, 
    otpError,
    confirmRenewal, 
    verifyOtp, 
    resendOtp, 
    cancelRenewal,
  } = useRegisterAndCheckout(form);

  const { 
    activeStep, 
    page, 
    handleStepClick, 
    handleBack, 
    handleNext 
  } = useStepper(STEPS.length);

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
            {page === 1 && <PrivacyPolicyNotice handleNext={handleNext} />}
            {page === 2 && <PersonalInformation form={form} handleBack={handleBack} handleNext={handleNext} />}
            {page === 3 && <AddressDetails form={form} handleBack={handleBack} handleNext={handleNext} />}
            {page === 4 && <UploadPicture form={form} handleBack={handleBack} handleNext={handleNext} />}
            {page === 5 && <MembershipPlan form={form} handleBack={handleBack} handleNext={handleNext} />}
            {page === 6 && <Review form={form} handleBack={handleBack} isProcessing={loading} onCheckout={checkout} />}
            </div>
        </div>
      </div>

      {step === "renew" && (
        <RenewMembershipDialog
          expiresAt={expiresAt}
          onConfirm={confirmRenewal}
          onCancel={cancelRenewal}
        />
      )}

      {step === "otp" && (
        <VerifyEmailDialog
          email={form.state.values.emailAddress}
          error={otpError}
          onVerify={verifyOtp}
          onResend={resendOtp}
          onCancel={cancelRenewal}
        />
      )}
    </div>
  );
};

export default RegistrationPage;