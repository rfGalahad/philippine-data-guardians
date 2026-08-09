import { useEffect, useMemo, useState } from "react";
import { CheckCircle } from "lucide-react";

import Button from "@/components/ui/Button";

import { createCheckout } from "@/features/checkout/api/createCheckout";
import { useToast } from "@/components/Toast";

import { useSubmitRegistration } from "../hooks/useSubmitRegistration";
import { FormHeader } from "./FormHeader";

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface ReviewProps {
  handleBack: () => void;
}
interface SectionLabelProps {
  children: React.ReactNode;
}
interface InformationFieldProps {
  label: string;
  value?: string | null;
}

//-----------------------------------------------------------
// SUB COMPONENTS
//-----------------------------------------------------------

const SectionLabel = ({ children }: SectionLabelProps) => (
  <span className="mb-3 block text-[0.65rem] font-bold uppercase tracking-[1.5px] text-[#053261]/50">
    {children}
  </span>
);

const InformationField = ({ label, value }: InformationFieldProps) => {
  return (
    <div>
      <span className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.8px] text-gray-400">
        {label}
      </span>
      <p
        className={`wrap-break-word text-[0.9rem] font-medium ${
          value ? "text-gray-900" : "text-gray-400"
        }`}
      >
        {value || "—"}
      </p>
    </div>
  );
};

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export const Review = ({ handleBack }: ReviewProps) => {

  const toast = useToast();

  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const { 
    formData,
    loading: submitLoading,   
    submitForm, 
  } = useSubmitRegistration();

  const isProcessing = submitLoading || checkoutLoading; 

  const { 
    personalInfo, 
    addressDetails, 
    membershipType, 
    uploadPicture 
  } = formData;

  const previewUrl = useMemo(() => {
    if (!uploadPicture) return undefined;
    if (typeof uploadPicture === "string") return uploadPicture;
    return URL.createObjectURL(uploadPicture);
  }, [uploadPicture]);

  useEffect(() => {
    if (!previewUrl || typeof uploadPicture === "string") return;
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl, uploadPicture]);

  const fullName = [
    personalInfo.firstName,
    personalInfo.middleName,
    personalInfo.lastName,
    personalInfo.suffix,
  ]
    .filter(Boolean)
    .join(" ");

  const fullAddress = [
    addressDetails.houseNumber,
    addressDetails.street,
    addressDetails.barangayName,
    addressDetails.cityMunicipalityName,
    addressDetails.provinceName,
  ]
    .filter(Boolean)
    .join(", ");

  const contactNumber = personalInfo.contactNumber;
  const membershipTier = membershipType.tier;

  const handleCheckout = async () => {
    
    const registration = await submitForm();
    console.log("registration result:", registration);
    if (!registration) return;
 
    setCheckoutLoading(true);
    try {
      const data = await createCheckout({
        subscriberId: registration.subscriberId,
        subscriptionId: registration.subscriptionId,
        customerName: fullName,
        price: Number(membershipType?.cost),
        name: membershipType?.tier || "Professionals",
        serviceName: "membership",
        email: personalInfo.emailAddress,
        description: `${membershipType?.tier} - PDG Membership Registration`,
        appOrigin: window.location.origin,
        cancelUrl: `${window.location.origin}`,
      });

      if (data.url) window.location.href = data.url;

    } catch (err) {
      toast.error(`Checkout Error`)
      console.error("Checkout Error:", err)
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* FormHeader */}
      <FormHeader
        title="Review & Submit"
        icon={<CheckCircle className="text-[#053261]" />}
      />      

      {/* REVIEW DETAILS */}
      <div className="flex flex-col gap-4 px-6">
        {/* PROFILE PICTURE + NAME HERO */}
        <div className="flex items-center gap-4 rounded-xl border border-[#053261]/8 bg-linear-to-br from-[#f0f4f9] to-[#e8eef6] p-5">
          <img
            src={previewUrl}
            alt="Profile picture"
            className="h-20 w-20 shrink-0 rounded-[10px] border-[3px] border-white bg-[#dce4ee] object-cover shadow-[0_4px_12px_rgba(5,50,97,0.15)]"
          />
          <div>
            <h3 className="mb-1 text-lg font-bold leading-[1.2] text-[#053261]">
              {fullName || "—"}
            </h3>
            <div className="inline-flex items-center rounded-lg bg-[#053261]/8 px-3 py-1">
              <span className="text-[0.72rem] font-semibold tracking-wide text-[#053261]">
                {membershipTier || "No tier selected"}
              </span>
            </div>
          </div>
        </div>

        {/* PERSONAL INFO */}
        <div className="px-2">
          <SectionLabel>Personal Information</SectionLabel>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InformationField label="Email Address" value={personalInfo.emailAddress} />
            <InformationField
              label="Contact Number"
              value={contactNumber ? `(+63) ${contactNumber}` : null}
            />
          </div>
        </div>

        <hr className="border-[#053261]/8" />

        {/* ADDRESS */}
        <div className="px-2">
          <SectionLabel>Address</SectionLabel>
          <InformationField label="Complete Address" value={fullAddress} />
        </div>
      </div>

      {/* FORM BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full border-t rounded-b-2xl p-6 border-gray-200 bg-gray-50">
        <Button
          label="Previous Step"
          variant="outlined"
          color="white"
          type="button"
          onClick={handleBack}
          fullWidth
        />
        <Button
          label={isProcessing ? "Loading..." : "Proceed to Payment"}
          color="neutral"
          type="button"
          onClick={handleCheckout}
          disabled={isProcessing}
          fullWidth
        />
      </div>
    </div>
  );
};

export default Review;