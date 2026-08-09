import { useRef, useState, useCallback } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { useObjectUrl } from "@/hooks/useObjectUrl";

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface ImageUploaderProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  helperText?: string;
}

//-----------------------------------------------------------
// IMAGE UPLOADER
//-----------------------------------------------------------

export const ImageUploader = ({
  value,
  onChange,
  accept = "image/png, image/jpeg, image/webp",
  maxSizeMB = 5,
  label = "Upload a picture",
  helperText = "PNG, JPG or WEBP (max 5MB)",
}: ImageUploaderProps) => {

  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const preview = useObjectUrl(value);

  const handleFile = useCallback(
    (file: File | undefined) => {
      setError(null);

      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file.");
        return;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`Image must be smaller than ${maxSizeMB}MB.`);
        return;
      }

      onChange(file);
    },
    [maxSizeMB, onChange]
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
    setError(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
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
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
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
              {value?.name}
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

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default ImageUploader;