import { useState } from "react";

import Button from "@/components/ui/Button";
import ImageUploader from "@/components/ImageUploader";

import { useFormContext } from "../../../context/FormContext";
import { useToast } from "@/components/Toast";

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface UploadPictureProps {
  handleBack: () => void;
  handleNext: () => void;
}

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const SECTION_KEY = "uploadPicture"

//-----------------------------------------------------------
// UPLOAD PICTURE
//-----------------------------------------------------------

export const UploadPicture = ({ 
  handleBack, 
  handleNext 
}: UploadPictureProps) => {
  
  const { formData, updateFormData } = useFormContext();
  
  const [image, setImage] = useState<File | null>(
    (formData?.[SECTION_KEY] as File) ?? null
  );

  const toast = useToast();

  const handleSubmit = () => {
    if (!image) return toast.error("Please upload a picture!");
    updateFormData(SECTION_KEY, image);
    handleNext();
  }

  return (
    <div className="flex flex-col gap-8">

      {/* UPLOAD PICTURE */}
      <ImageUploader
        value={image}
        onChange={setImage}
        label="Member Photo"
        helperText="PNG, JPG or WEBP (max 5MB)"
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
          onClick={handleSubmit}
          fullWidth
        />
      </div>
    </div>
  );
};

export default UploadPicture;