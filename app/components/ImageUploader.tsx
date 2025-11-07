"use client";

import { useRef } from "react";

interface ImageUploaderProps {
  label: string;
  imageSrc: string | null;
  onImageChange: (image: string) => void;
  accept?: string;
}

export default function ImageUploader({
  label,
  imageSrc,
  onImageChange,
  accept = "image/*",
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = `file-input-${label.replace(/\s+/g, "-").toLowerCase()}`;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        className="relative flex items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors bg-gray-50 dark:bg-gray-800"
      >
        {imageSrc ? (
          <img src={imageSrc} alt={label} className="w-full h-full object-contain rounded-lg" />
        ) : (
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              クリックしてアップロード
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">PNG、JPG、JPEG（最大10MB）</p>
          </div>
        )}
        <input
          id={inputId}
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
