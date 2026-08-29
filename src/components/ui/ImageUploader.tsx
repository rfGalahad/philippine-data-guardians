import { useRef, useState, useCallback } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { useObjectUrl } from "@/hooks/useObjectUrl";
import { useFieldContext } from "@/lib/form"; 

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface ImageUploaderFieldProps {
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  helperText?: string;
}

//-----------------------------------------------------------
// HELPERS
//-----------------------------------------------------------

const getErrorMessage = (errors: unknown[]): string | undefined => {
  const first = errors[0];
  if (first == null) return undefined;
  if (typeof first === "string") return first;
  if (typeof first === "object" && "message" in first) {
    return (first as { message: string }).message;
  }
  return undefined;
};

//-----------------------------------------------------------
// IMAGE UPLOADER
//-----------------------------------------------------------

export const ImageUploader = ({
  accept = "image/png, image/jpeg, image/webp",
  maxSizeMB = 5,
  label = "Upload a picture",
  helperText = "PNG, JPG or WEBP (max 5MB)",
}: ImageUploaderFieldProps) => {
  const field = useFieldContext<File | null>();

  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [localError, setLocalError] = useState<string | null>(null);

  const preview = useObjectUrl(field.state.value);

  const formErrors = field.state.meta.isTouched ? field.state.meta.errors : [];
  const formErrorMessage = getErrorMessage(formErrors);
  const errorMessage = localError ?? formErrorMessage;

  const id = field.name;
  const feedbackId = errorMessage || helperText ? `${id}-feedback` : undefined;

  const handleFile = useCallback(
    (file: File | undefined) => {
      setLocalError(null);
      field.handleBlur();

      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setLocalError("Please select a valid image file.");
        return;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        setLocalError(`Image must be smaller than ${maxSizeMB}MB.`);
        return;
      }

      field.handleChange(file);
    },
    [maxSizeMB, field]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      handleFile(e.dataTransfer.files?.[0]);
    },
    [handleFile]
  );

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalError(null);
    field.handleChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-700" htmlFor={id}>
          {label}
        </label>
      )}

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-colors
          ${
            isDragging
              ? "border-neutral-500 bg-neutral-50"
              : "border-gray-300 hover:border-gray-400 bg-white"
          }`}
      >
        <input
          ref={inputRef}
          id={id}
          name={field.name}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
          aria-invalid={!!errorMessage}
          aria-describedby={feedbackId}
        />

        {preview ? (
          <div className="relative w-full flex flex-col items-center gap-3">
            <img
              src={preview}
              alt="Preview"
              className="max-h-56 rounded-lg object-contain"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 rounded-full bg-white border border-gray-200 p-1 shadow-sm hover:bg-gray-50"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
            <span className="text-xs text-gray-500 truncate max-w-full">
              {field.state.value?.name}
            </span>
          </div>
        ) : (
          <>
            <div className="rounded-full bg-gray-100 p-3">
              {isDragging ? (
                <Upload className="w-6 h-6 text-gray-500" />
              ) : (
                <ImageIcon className="w-6 h-6 text-gray-500" />
              )}
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-neutral-700">
                Click to upload
              </span>{" "}
              or drag and drop
            </p>
            <p className="text-xs text-gray-400">{helperText}</p>
          </>
        )}
      </div>

      {errorMessage && (
        <span id={feedbackId} className="text-xs text-red-500" role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default ImageUploader;