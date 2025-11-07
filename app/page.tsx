"use client";

import type { ImageUploadState, TryOnResponse } from "@/types";
import { useEffect, useState } from "react";
import ImageUploader from "./components/ImageUploader";
import TryOnResult from "./components/TryOnResult";

const STORAGE_KEY_PERSON = "virtual-try-on-person-image";
const STORAGE_KEY_PRODUCT = "virtual-try-on-product-image";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [images, setImages] = useState<ImageUploadState>({
    personImage: null,
    productImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<string[]>([]);

  // クライアント側でマウントされたことを検知
  useEffect(() => {
    setMounted(true);
  }, []);

  // マウント後にlocalStorageから画像を読み込む
  useEffect(() => {
    if (!mounted) return;

    const savedPersonImage = localStorage.getItem(STORAGE_KEY_PERSON);
    const savedProductImage = localStorage.getItem(STORAGE_KEY_PRODUCT);

    if (savedPersonImage || savedProductImage) {
      setImages({
        personImage: savedPersonImage,
        productImage: savedProductImage,
      });
    }
  }, [mounted]);

  const handlePersonImageChange = (image: string) => {
    setImages((prev) => ({ ...prev, personImage: image }));
    localStorage.setItem(STORAGE_KEY_PERSON, image);
    setError(null);
  };

  const handleProductImageChange = (image: string) => {
    setImages((prev) => ({ ...prev, productImage: image }));
    localStorage.setItem(STORAGE_KEY_PRODUCT, image);
    setError(null);
  };

  const handleClearImages = () => {
    setImages({ personImage: null, productImage: null });
    setResults([]);
    setError(null);
    localStorage.removeItem(STORAGE_KEY_PERSON);
    localStorage.removeItem(STORAGE_KEY_PRODUCT);
  };

  const handleTryOn = async () => {
    if (!images.personImage || !images.productImage) {
      setError("人物の写真と服の画像の両方をアップロードしてください");
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch("/api/try-on", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personImage: images.personImage,
          productImages: [images.productImage],
          sampleCount: 2,
          baseSteps: 32,
        }),
      });

      const data: TryOnResponse = await response.json();

      if (!data.success) {
        setError(data.error || "試着画像の生成に失敗しました");
        return;
      }

      if (data.images) {
        setResults(data.images);
      }
    } catch (err) {
      setError("リクエストの処理中にエラーが発生しました");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const canTryOn = images.personImage && images.productImage && !loading;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Virtual Try-On Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            あなたの写真と試着したい服の画像をアップロードして、Google AIで試着体験
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">画像のアップロード</h2>
            {(images.personImage || images.productImage) && (
              <button
                onClick={handleClearImages}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                type="button"
              >
                画像をクリア
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <ImageUploader
              label="あなたの写真"
              imageSrc={images.personImage}
              onImageChange={handlePersonImageChange}
            />
            <ImageUploader
              label="服の画像"
              imageSrc={images.productImage}
              onImageChange={handleProductImageChange}
            />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleTryOn}
              disabled={!canTryOn}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-lg shadow-md hover:shadow-lg"
              type="button"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    role="img"
                    aria-label="Loading"
                  >
                    <title>Loading spinner</title>
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  生成中...
                </span>
              ) : (
                "試着する"
              )}
            </button>
          </div>
        </div>

        {results.length > 0 && <TryOnResult images={results} />}

        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Google Cloud Vertex AI Virtual Try-On APIを使用</p>
        </div>
      </div>
    </main>
  );
}
