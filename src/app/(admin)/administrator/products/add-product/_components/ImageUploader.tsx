"use client";

import { IconImageUploader } from "@/components/svg/IconImageUploader";
import { useState, useRef, useCallback } from "react";

interface ImageUploaderProps {
  onImageUploadAction: (file: File) => void;
  maxSize?: number;
}

export default function ImageUploader({
  onImageUploadAction,
  maxSize = 5 * 1024 * 1024,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [converting, setConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertToJpeg = useCallback(async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Ошибка конвертации"));
            resolve(
              new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                type: "image/jpeg",
              }),
            );
          },
          "image/jpeg",
          0.9,
        );
      };

      img.onerror = () => reject(new Error("Ошибка загрузки изображения"));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        return setError("Разрешены только изображения (JPG, PNG, WebP, GIF)");
      }
      if (file.size > maxSize) {
        return setError(
          `Файл слишком большой. Максимум ${maxSize / 1024 / 1024}MB`,
        );
      }

      setError("");
      setConverting(true);

      try {
        const finalFile = file.type.includes("image/jpeg")
          ? file
          : await convertToJpeg(file);
        onImageUploadAction(finalFile);
      } catch {
        setError("Ошибка при обработке изображения");
      } finally {
        setConverting(false);
      }
    },
    [convertToJpeg, onImageUploadAction, maxSize],
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-custom ${
          isDragging
            ? "border-primary bg-[#e5ffde]"
            : "border-gray-300 hover:border-gray-400"
        } ${converting ? "opacity-50 cursor-not-allowed" : ""}`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onClick={converting ? undefined : () => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="space-y-2">
          {converting ? (
            <div className="w-12 h-12 mx-auto border-b-2 rounded-full animate-spin border-primary"></div>
          ) : (
            <IconImageUploader />
          )}

          <p className="text-sm text-gray-600">
            {converting ? (
              "Конвертация в JPG..."
            ) : (
              <>
                Перетащите изображение или{" "}
                <span className="font-medium text-primary hover:text-[#008c49] transition-custom">
                  выберите файл
                </span>
              </>
            )}
          </p>

          <p className="text-xs text-gray-500">
            {converting
              ? "Пожалуйста, подождите"
              : `JPG, PNG, WebP, GIF до ${maxSize / 1024 / 1024}MB`}
          </p>
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
