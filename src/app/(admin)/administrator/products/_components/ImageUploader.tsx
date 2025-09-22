'use client';

import { useState, useRef, useCallback } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  maxSize?: number;
}

export default function ImageUploader({
  onImageUpload,
  maxSize = 5 * 1024 * 1024
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): boolean => {
    if (!file.type.includes('image/jpeg')) {
      setError('Разрешены только JPG изображения');
      return false;
    }

    if (file.size > maxSize) {
      setError(`Файл слишком большой. Максимум ${maxSize / 1024 / 1024}MB`);
      return false;
    }

    setError('');
    return true;
  }, [maxSize]);

  const handleFile = useCallback((file: File) => {
    if (validateFile(file)) {
      onImageUpload(file);
    }
  }, [validateFile, onImageUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
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

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
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
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={triggerFileInput}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg"
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="space-y-2">
          <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          
          <p className="text-sm text-gray-600">
            Перетащите JPG изображение сюда или{' '}
            <span className="text-blue-600 hover:text-blue-800 font-medium">
              выберите файл
            </span>
          </p>
          
          <p className="text-xs text-gray-500">
            JPG до {maxSize / 1024 / 1024}MB
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}