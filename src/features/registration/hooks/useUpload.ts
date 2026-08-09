import { useEffect, useMemo, useState, type ChangeEvent, type DragEvent } from "react";

import { useFormContext } from "../context/FormContext";

interface UseUploadReturn {
  image: File | null;
  imagePreview: string | null;
  dragActive: boolean;
  error: string;
  handleDrag: (e: DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: DragEvent<HTMLDivElement>) => void;
  handleFileInput: (e: ChangeEvent<HTMLInputElement>) => void;
  removeImage: () => void;
  handleSubmit: () => void;
}

export const useUpload = (handleNext: () => void): UseUploadReturn => {

  const { formData, updateFormData } = useFormContext();

  const [image, setImage] = useState<File | null>(() => {
    const item = formData.uploadPicture;
    return item instanceof File ? item : null;
  });

  // if the existing value was already a string URL (e.g. loaded from server), keep it separately
  const [existingUrl] = useState<string | null>(() => {
    const item = formData.uploadPicture;
    return typeof item === "string" ? item : null;
  });

  // DERIVED VALUE — computed during render, not stored as its own state
  const imagePreview = useMemo(() => {
    if (image) return URL.createObjectURL(image);
    if (existingUrl) return existingUrl;
    return null;
  }, [image, existingUrl]);

  // CLEANUP ONLY — revoke the blob URL whenever it changes or on unmount.
  // No setState here, so this doesn't trigger cascading renders.
  useEffect(() => {
    if (!image || !imagePreview) return;
    return () => {
      URL.revokeObjectURL(imagePreview);
    };
  }, [image, imagePreview]);

  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  const validateFile = (file: File): string | null => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      return "Only JPG, JPEG, and PNG files are allowed";
    }
    if (file.size > maxSize) {
      return "File size must be less than 5MB";
    }
    return null;
  };

  const handleFiles = (file: File) => {
    setError("");

    const validationError = validateFile(file);
    if (validationError) {
      setImage(null);
      setError(validationError);
      return;
    }
    setImage(file);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setImage(null);
    setError("");
  };

  const handleSubmit = () => {
    if (!image) {
      setError("Please upload a picture");
      return;
    }
    updateFormData("uploadPicture", image);
    handleNext();
  };

  return {
    image,
    imagePreview,
    dragActive,
    error,
    handleDrag,
    handleDrop,
    handleFileInput,
    removeImage,
    handleSubmit,
  };
};