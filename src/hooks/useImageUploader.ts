// hooks/useImageUpload.ts
import { useState } from 'react';

interface UploadResult {
  imageUrl: string;
  filename: string;
}

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<UploadResult | null> => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Неизвестная ошибка');
      }

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImage,
    isUploading,
    error,
  };
}