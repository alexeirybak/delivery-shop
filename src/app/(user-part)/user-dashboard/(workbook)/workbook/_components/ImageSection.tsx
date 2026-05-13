import Image from "next/image";
import { AlertCircle, Upload, XCircle } from "lucide-react";
import { useRef } from "react";
import { useRecordStore } from "@/store/recordStore";
import { ImageSectionProps } from "../../records/types";
import { useCategoryStore } from "@/store/categoryStore";
import "../../styles/image-section.css";

export const ImageSection = ({
  type,
  onFileChange,
  onRemoveImage,
}: ImageSectionProps) => {
  const categoryStore = useCategoryStore();
  const recordStore = useRecordStore();
  const storeData = type === "category" ? categoryStore : recordStore;
  const entityName = type === "category" ? "тетради" : "записи";

  const { editingId, isUploading, isSubmitting, formData } = storeData;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRemoveImage = () => {
    onRemoveImage();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  return (
    <div className="image-section">
      <h3 className="image-section-title">Изображение {entityName}</h3>
      <div className="image-section-content">
        {formData.image && (
          <div className="image-preview-container">
            <div className="image-preview-wrapper">
              <div className="image-preview">
                <Image
                  src={formData.image}
                  alt="Предпросмотр"
                  width={160}
                  height={160}
                  className="image-preview-img"
                  unoptimized={true}
                />
              </div>
              <div className="image-preview-info">
                <p className="image-preview-text">
                  {formData.image.startsWith("blob:")
                    ? `Новое изображение (будет загружено при сохранении) ${entityName}`
                    : `Текущее изображение ${entityName}`}
                </p>
                {formData.image.startsWith("blob:") && (
                  <p className="image-preview-badge">
                    <AlertCircle />
                    Старое изображение будет удалено после сохранения
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isUploading || isSubmitting}
                  className="image-remove-btn"
                >
                  <XCircle />
                  Удалить изображение
                </button>
              </div>
            </div>
          </div>
        )}
        <div>
          <label className="image-upload-label">
            {formData.image ? "Заменить изображение" : "Загрузить изображение"}
            <span className="image-upload-hint">(максимум 1MB)</span>
          </label>
          <div className="image-upload-wrapper">
            <div className="image-upload-input">
              <label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={onFileChange}
                  disabled={isUploading || isSubmitting}
                />
                <div className="image-upload-button">
                  <div className="image-upload-button-content">
                    <Upload />
                    <span>Выберите файл</span>
                  </div>
                </div>
              </label>
            </div>
            {isUploading && (
              <div className="image-upload-loading">
                <div className="image-upload-spinner"></div>
                Обработка...
              </div>
            )}
          </div>
          <p className="image-upload-footer">
            Поддерживаемые форматы: JPG, PNG, GIF, WebP.
            {editingId &&
              formData.image &&
              formData.image.startsWith("blob:") && (
                <span className="image-warning">
                  <AlertCircle />
                  При сохранении старое изображение будет удалено
                </span>
              )}
          </p>
        </div>
      </div>
    </div>
  );
};
