import { CheckCircle } from "lucide-react";
import { useSelector } from "@tanstack/react-form";

import Button from "@/components/ui/Button";
import { useObjectUrl } from "@/hooks/useObjectUrl";

import type { AppForm } from "../../hooks/useRegistrationForm";
import { FormHeader } from "./FormHeader";
import { getFullAddress, getFullName } from "@/utils/string";

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface ReviewDetailsProps {
  form: AppForm;
  handleBack: () => void;
  isProcessing?: boolean;
  onCheckout: () => void;
  hideHeader?: boolean;
  singleColumn?: boolean;
  addMemberMode?: boolean;
  updateMemberMode?: boolean;
}

interface SectionLabelProps {
  children: React.ReactNode;
}

interface InformationFieldProps {
  label: string;
  value?: string | null;
}

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const PLAN_LABELS: Record<string, string> = {
  "Student/Academe": "Student/Academy Member",
  Professionals: "Professional Member",
};

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

export const ReviewDetails = ({
  form,
  handleBack,
  isProcessing = false,
  onCheckout,
  hideHeader = false,
  singleColumn = false,
  addMemberMode = false,
  updateMemberMode = false
}: ReviewDetailsProps) => {

  const values = useSelector(form.store, (state) => state.values);

  const uploadedFile = values.uploadPicture instanceof File ? values.uploadPicture : null;
  const objectUrl = useObjectUrl(uploadedFile);
  const previewUrl = typeof values.uploadPicture === "string" ? values.uploadPicture : objectUrl;

  const fullName = getFullName(values);
  const fullAddress = getFullAddress(values);

  const membershipTier = values.plan
    ? PLAN_LABELS[values.plan] ?? values.plan
    : null;

  return (
    <div className="flex flex-col gap-4">
      {/* FormHeader */}
      {!hideHeader && (
        <FormHeader
          title="Review & Submit"
          icon={<CheckCircle className="text-[#053261]" />}
        />
      )}

      {/* REVIEW DETAILS */}
      <div className={`flex flex-col gap-4 ${singleColumn ? '' : 'px-6'}`}>
        {/* PROFILE PICTURE + NAME HERO */}
        <div className="flex items-center gap-4 rounded-xl border border-[#053261]/8 bg-linear-to-br from-[#f0f4f9] to-[#e8eef6] p-5">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile picture"
              className="h-20 w-20 shrink-0 rounded-[10px] border-[3px] border-white bg-[#dce4ee] object-cover shadow-[0_4px_12px_rgba(5,50,97,0.15)]"
            />
          ) : (
            <div className="h-20 w-20 shrink-0 rounded-[10px] border-[3px] border-white bg-[#dce4ee] shadow-[0_4px_12px_rgba(5,50,97,0.15)]" />
          )}
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
            <InformationField label="Email Address" value={values.emailAddress} />
            <InformationField
              label="Contact Number"
              value={values.contactNumber ? `${values.contactNumber}` : null}
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
          label={isProcessing ? "Loading..." : addMemberMode ? "Add Member" : updateMemberMode ? "Update Member" : "Proceed to Payment"}
          color="neutral"
          type="button"
          onClick={onCheckout}
          disabled={isProcessing}
          fullWidth
        />
      </div>
    </div>
  );
};

export default ReviewDetails;