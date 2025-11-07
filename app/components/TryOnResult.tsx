"use client";

interface TryOnResultProps {
  images: string[];
}

export default function TryOnResult({ images }: TryOnResultProps) {
  const handleDownload = (image: string, index: number) => {
    const link = document.createElement("a");
    link.href = image;
    link.download = `try-on-result-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Try-On Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((image, index) => (
          <div
            key={image}
            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={image}
              alt={`Try-on result ${index + 1}`}
              className="w-full h-auto object-contain"
            />
            <div className="p-4">
              <button
                onClick={() => handleDownload(image, index)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                type="button"
              >
                Download Image {index + 1}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
