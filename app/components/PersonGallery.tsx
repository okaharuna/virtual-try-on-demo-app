"use client";

import { useEffect, useState } from "react";

interface PersonGalleryProps {
  onSelectPerson: (imageUrl: string) => void;
  selectedImage: string | null;
}

export default function PersonGallery({ onSelectPerson, selectedImage }: PersonGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 画像リストを取得
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/images/person");
        const data = await response.json();
        setImages(data.images || []);
      } catch (error) {
        console.error("Failed to fetch person images:", error);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center">画像を読み込み中...</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-medium">ヒント:</span>{" "}
          <code className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded">
            public/sample-person
          </code>{" "}
          フォルダに人物の画像を追加すると、ここから選択できるようになります。
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-between"
        type="button"
      >
        <span>サンプルから選択</span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="grid grid-cols-3 gap-3">
            {images.map((imageUrl) => (
              <button
                key={imageUrl}
                onClick={() => {
                  onSelectPerson(imageUrl);
                  setIsOpen(false);
                }}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage?.includes(imageUrl)
                    ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800"
                    : "border-gray-300 dark:border-gray-600 hover:border-blue-300"
                }`}
                type="button"
              >
                <img src={imageUrl} alt="人物の画像" className="w-full h-full object-cover" />
                {selectedImage?.includes(imageUrl) && (
                  <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-blue-600 dark:text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      role="img"
                      aria-label="選択済み"
                    >
                      <title>選択済み</title>
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
