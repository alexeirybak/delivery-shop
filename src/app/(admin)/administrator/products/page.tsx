// components/ProductForm.tsx
'use client';

import { useState } from 'react';
import ImageUploader from './_components/ImageUploader';
import { useImageUpload } from '@/hooks/useImageUploader';
import Image from 'next/image';

export default function ProductForm() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const { uploadImage, isUploading, error } = useImageUpload();

  const handleImageUpload = async (file: File) => {
    const result = await uploadImage(file);
    if (result) {
      setUploadedImages(prev => [...prev, result.imageUrl]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Добавление товара</h2>
      
      {/* Поле загрузки изображений */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Изображения товара
        </label>
        
        <ImageUploader onImageUpload={handleImageUpload} />
        
        {isUploading && (
          <p className="mt-2 text-sm text-blue-600">Загрузка...</p>
        )}
        
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      {/* Предпросмотр загруженных изображений */}
      {uploadedImages.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Загруженные изображения:</h3>
          <div className="grid grid-cols-3 gap-4">
            {uploadedImages.map((url, index) => (
              <div key={index} className="relative group">
                <Image
                  src={url}
                  alt={`Uploaded ${index + 1}`}
                  width={150}
                  height={150}
                  className="rounded-lg object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Остальная форма товара */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Название товара
          </label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Описание
          </label>
          <textarea
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Сохранить товар
        </button>
      </div>
    </div>
  );
}