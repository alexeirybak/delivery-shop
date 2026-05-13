import { useRef, useCallback } from "react";
import { Image as ImageIcon } from "lucide-react";
import { ImageUploadButtonProps } from "../types";
import "../styles/image-upload.css";

export const ImageUploadButton = ({
  images,
  onImagesChange,
  disabled = false,
}: ImageUploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const newImages = [];

      for (const file of files) {
        if (file.type.startsWith("image/")) {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              resolve(result.split(",")[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          newImages.push({ base64, mimeType: file.type });
        }
      }

      if (onImagesChange) {
        onImagesChange([...images, ...newImages]);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [images, onImagesChange],
  );

  if (disabled) {
    return null;
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="image-upload-btn"
        title="Добавить изображение для распознавания текста"
      >
        <ImageIcon size={20} />
      </button>
    </>
  );
};
