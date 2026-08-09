import { useState } from "react";

import Button from "@/components/ui/Button";

import { useObjectUrl } from "@/hooks/useObjectUrl";
import { useToast } from "@/components/Toast";
import { getPhotoUrl, getPlanName } from "@/features/registration/utils/helper";
import { createRegistrationPayload } from "@/features/registration/utils/create-registration-payload";

import { registerMember } from "@/lib/supabase/members";
import { getPlanByTierName } from "@/lib/supabase/plan";
import { removeMemberPhoto } from "@/lib/supabase/member-photos";

import { useFormContext } from "../../../context/FormContext";


//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface ReviewProps {
  handleBack: () => void;
  handleClose: () => void;
}

interface InformationFieldProps {
  label: string;
  value?: string | null;
}

//-----------------------------------------------------------
// SUB COMPONENTS
//-----------------------------------------------------------

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
        {value || "N/A"}
      </p>
    </div>
  );
};

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export const ReviewDetails = ({ 
  handleBack,
  handleClose
}: ReviewProps) => {

  const [loading, setLoading] = useState(false);
  const { formData, clearFormData } = useFormContext();
  const toast = useToast();

  const submitForm = async (): Promise<{ subscriberId: string; subscriptionId: string } | null> => {

    setLoading(true);

    let photoPath: string | null = null;

    try {
      const {
        personalInfo,
        addressDetails,
        membershipPlan,
        uploadPicture,
        payment
      } = formData;

      if (!uploadPicture) {
        toast.error("Please upload a photo before proceeding.");
        return null;
      }

      if (!membershipPlan.plan) {
        toast.error("Please select a membership type.");
        return null;
      }

      // UPLOAD PHOTO AND GET ITS URL
      const { 
        photoUrl, 
        photoPath: uploadedPhotoPath 
      } = await getPhotoUrl(uploadPicture);
      photoPath = uploadedPhotoPath;

      // GET THE SELECTED MEMBERSHIP PLAN
      const plan = await getPlanByTierName(getPlanName(membershipPlan.plan));

      // CREATE REGISTRATION PAYLOAD
      const payload = createRegistrationPayload({
        personalInfo,
        addressDetails,
        photoUrl,
        plan,
        payment,
        paymentStatus: 'paid'
      });

      const result = await registerMember(payload); 

      if (result) {
        toast.success("Member Added Successfully!");
        clearFormData();
        handleClose();
      }

      return { 
        subscriberId: result.subscriber_id, 
        subscriptionId: result.subscription_id 
      };
    } catch (err) {
      if (photoPath) await removeMemberPhoto(photoPath);
      toast.error("Failed submitting registration form.");
      console.error('Submit error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const { 
    personalInfo, 
    addressDetails, 
    membershipPlan, 
    uploadPicture 
  } = formData;

  const isFile = uploadPicture instanceof File;
  const objectUrl = useObjectUrl(isFile ? uploadPicture : null);  
  const previewUrl = isFile ? objectUrl ?? undefined : (uploadPicture as string | undefined);

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
  const membershipTier = membershipPlan.plan;

  return (
    <div className="flex flex-col gap-4">
  
      {/* REVIEW DETAILS */}
      <div className="flex flex-col gap-4">
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

        <div className="flex flex-col gap-4 p-2">
          <InformationField 
            label="Email Address" 
            value={personalInfo.emailAddress} 
          />
          <InformationField
            label="Contact Number"
            value={contactNumber ? `(+63) ${contactNumber}` : null}
          />
          <InformationField 
            label="Complete Address" 
            value={fullAddress} 
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-6">
        <Button
          label="Previous Step"
          variant="outlined"
          color="white"
          onClick={handleBack}
          fullWidth
        />
        <Button
          label={loading ? "Adding Member..." : "Add Member"}
          color="neutral"
          disabled={loading}
          onClick={submitForm}
          fullWidth
        />
      </div>
    </div>
  );
};

export default ReviewDetails;