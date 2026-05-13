import Image from "next/image";
import { X } from "lucide-react";
import { ImagePreviewProps } from "../types";
import "../styles/image-preview.css";

export const ImagePreview = ({ images, onRemove }: ImagePreviewProps) => {
  if (images.length === 0) return null;

  return (
    <div className="images-preview">
      {images.map((image, index) => (
        <div key={index} className="image-preview-item">
          <Image
            src={`data:${image.mimeType};base64,${image.base64}`}
            alt={`Preview ${index + 1}`}
            className="preview-image"
            width={200}
            height={200}
          />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="remove-image-btn"
            title="Удалить изображение"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};