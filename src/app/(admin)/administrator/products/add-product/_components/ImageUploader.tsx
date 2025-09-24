'use client';

import { useState, useRef, useCallback } from 'react';

interface ImageUploaderProps {
  onImageUploadAction: (file: File) => void;
  maxSize?: number;
}

export default function ImageUploader({
  onImageUploadAction,
  maxSize = 5 * 1024 * 1024
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [converting, setConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertToJpeg = useCallback(async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Заполняем белым фоном для прозрачных изображений
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        }
        
        canvas.toBlob((blob) => {
          if (blob) {
            const convertedFile = new File([blob], 
              file.name.replace(/\.[^/.]+$/, ".jpg"), 
              { type: 'image/jpeg' }
            );
            resolve(convertedFile);
          } else {
            reject(new Error('Ошибка конвертации'));
          }
        }, 'image/jpeg', 0.9); // Качество 90%
      };
      
      img.onerror = () => reject(new Error('Ошибка загрузки изображения'));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const validateFile = useCallback((file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    
    if (!allowedTypes.includes(file.type)) {
      setError('Разрешены только изображения (JPG, PNG, WebP, GIF)');
      return false;
    }

    if (file.size > maxSize) {
      setError(`Файл слишком большой. Максимум ${maxSize / 1024 / 1024}MB`);
      return false;
    }

    setError('');
    return true;
  }, [maxSize]);

  const handleFile = useCallback(async (file: File) => {
    if (!validateFile(file)) return;

    setConverting(true);

    try {
      let finalFile = file;
      
      // Конвертируем в JPG если это не JPG
      if (!file.type.includes('image/jpeg')) {
        finalFile = await convertToJpeg(file);
      }
      
      onImageUploadAction(finalFile);
    } catch (err) {
      setError('Ошибка при обработке изображения');
      console.error('Conversion error:', err);
    } finally {
      setConverting(false);
    }
  }, [validateFile, convertToJpeg, onImageUploadAction]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFile(files[0]);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFile(files[0]);
    }
  }, [handleFile]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging 
            ? 'border-primary bg-[#e5ffde]' 
            : 'border-gray-300 hover:border-gray-400'
        } ${converting ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={converting ? undefined : triggerFileInput}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={converting}
        />
        
        <div className="space-y-2">
          {converting ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          ) : (
            <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          )}
          
          <p className="text-sm text-gray-600">
            {converting ? 'Конвертация в JPG...' : (
              <>
                Перетащите изображение сюда или{' '}
                <span className="text-primary hover:text-[#008c49] font-medium duration-300">
                  выберите файл
                </span>
              </>
            )}
          </p>
          
          <p className="text-xs text-gray-500">
            {converting ? 'Пожалуйста, подождите' : `JPG, PNG, WebP, GIF до ${maxSize / 1024 / 1024}MB`}
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}