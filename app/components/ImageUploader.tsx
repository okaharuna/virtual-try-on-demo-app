"use client";

import { useRef, useState } from "react";
import CameraCapture from "./CameraCapture";

interface ImageUploaderProps {
  label: string;
  imageSrc: string | null;
  onImageChange: (image: string) => void;
  accept?: string;
  enableCamera?: boolean;
}

export default function ImageUploader({
  label,
  imageSrc,
  onImageChange,
  accept = "image/*",
  enableCamera = false,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = `file-input-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // ファイル選択ダイアログが閉じたらメニューを閉じる
    setIsMenuOpen(false);
  };

  const handlePreviewClick = () => {
    if (enableCamera) {
      setIsMenuOpen(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileClick = () => {
    // ファイル選択ダイアログを直接開く
    fileInputRef.current?.click();
    // メニューはファイル選択後（handleFileChange）で閉じる
  };

  const handleCameraClick = () => {
    setIsMenuOpen(false);
    setIsCameraOpen(true);
  };

  const handleCameraCapture = (imageData: string) => {
    onImageChange(imageData);
    setIsCameraOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handlePreviewClick();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      {/* 画像プレビューエリア */}
      <div
        onClick={handlePreviewClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        className="relative flex items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        aria-label={imageSrc ? "画像を変更" : "画像をアップロード"}
      >
        {imageSrc ? (
          <img src={imageSrc} alt={label} className="w-full h-full object-contain rounded-lg" />
        ) : (
          <div className="text-center pointer-events-none">
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
              {enableCamera ? "クリックして選択" : "クリックしてアップロード"}
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

      {/* 選択メニューモーダル */}
      {enableCamera && isMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm mx-4">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">画像を選択</h3>
            </div>
            <div className="p-2">
              <button
                onClick={handleFileClick}
                className="w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-3"
                type="button"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="font-medium">ファイルから選択</span>
              </button>
              <button
                onClick={handleCameraClick}
                className="w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-3"
                type="button"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="font-medium">カメラで撮影</span>
              </button>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                type="button"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      {/* カメラモーダル */}
      {enableCamera && isCameraOpen && (
        <CameraCapture onCapture={handleCameraCapture} onClose={() => setIsCameraOpen(false)} />
      )}
    </div>
  );
}
