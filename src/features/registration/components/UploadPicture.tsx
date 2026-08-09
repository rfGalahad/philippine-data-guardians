import { Camera, X, UploadCloud } from "lucide-react";

import Button from "@/components/ui/Button";

import { useUpload } from "../hooks/useUpload";
import { FormHeader } from "./FormHeader";

interface UploadPictureProps {
  handleBack: () => void;
  handleNext: () => void;
}

export const UploadPicture = ({ handleBack, handleNext }: UploadPictureProps) => {
  
  const {
    image,
    imagePreview,
    dragActive,
    error,
    handleDrag,
    handleDrop,
    handleFileInput,
    removeImage,
    handleSubmit,
  } = useUpload(handleNext);

  return (
    <div className="flex flex-col gap-8">
      {/* FormHeader */}
      <FormHeader 
        title="Upload Picture" 
        icon={<Camera className="h-6 w-6 text-[#053261]" />} 
      />

      {/* UPLOAD PICTURE */}
      <div className="flex flex-col gap-4 px-6">
        {/* DRAG & DROP ZONE */}
        {!image ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input")?.click()}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-all duration-300 ${
              dragActive
                ? "border-[3px] border-[#053261] bg-[#f0f7ff]"
                : "border-[#ccc] bg-[#fafafa] hover:border-[#053261] hover:bg-[#f0f7ff]"
            }`}
          >
            <UploadCloud className="mx-auto mb-4 h-15 w-15 text-[#053261]" strokeWidth={1.5} />
            <p className="text-lg font-medium text-[#053261]">Drag and drop images here</p>
            <p className="text-sm text-gray-500">or click to browse</p>
            <p className="mt-1 block text-xs text-gray-500">
              Supported formats: JPG, JPEG, PNG (Max 5MB each)
            </p>
            <input
              id="file-input"
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={imagePreview ?? undefined}
                alt={image.name}
                className="h-62 w-auto rounded object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
                className="absolute right-1 top-1 rounded-full bg-white/90 p-1.5 hover:bg-white"
              >
                <X className="h-4 w-4 text-gray-700" />
              </button>
              <div className="absolute bottom-1.5 w-full bg-black/50 py-1">
                <p className="text-center text-sm text-white">{image.name}</p>
              </div>
            </div>
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && <p className="text-sm text-red-600">{error}</p>}
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
          label="Next Step"
          color="neutral"
          type="button"
          onClick={handleSubmit}
          fullWidth
        />
      </div>
    </div>
  );
};

export default UploadPicture;