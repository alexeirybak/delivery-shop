import { useRecordStore } from "@/store/recordStore";
import { Save, Star, FileText } from "lucide-react";
import { useState } from "react";
import "../styles/record-submit-section.css";

interface SubmitSectionProps {
  onCancel: () => void;
}

export const RecordSubmitSection = ({ onCancel }: SubmitSectionProps) => {
  const { updateFormField, isSubmitting, isUploading, formData } =
    useRecordStore();

  const [isFeatured, setIsFeatured] = useState<boolean>(
    formData.isFeatured || false,
  );

  const handleFeaturedChange = (featured: boolean) => {
    setIsFeatured(featured);
    updateFormField("isFeatured", featured);
  };

  const handleCancelWithConfirm = () => {
    const hasData =
      formData.name.trim() !== "" ||
      formData.image.trim() !== "" ||
      formData.content?.trim() !== "";

    if (hasData) {
      const confirmCancel = confirm(
        "Вы уверены, что хотите отменить создание записи? Все введенные данные будут потеряны.",
      );

      if (confirmCancel) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  return (
    <>
      <div className="record-submit-featured">
        <h3 className="record-submit-featured-title">
          <Star />
          Статус избранности
        </h3>
        <div className="record-submit-featured-buttons">
          <button
            type="button"
            onClick={() => handleFeaturedChange(false)}
            disabled={isUploading || isSubmitting}
            className={`record-submit-featured-btn ${
              !isFeatured
                ? "record-submit-featured-btn-normal-active"
                : "record-submit-featured-btn-normal-inactive"
            }`}
          >
            <FileText />
            <div className="record-submit-featured-btn-content">
              <div className="record-submit-featured-btn-title">
                Обычная запись
              </div>
              <div className="record-submit-featured-btn-desc">
                Стандартное отображение
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleFeaturedChange(true)}
            disabled={isUploading || isSubmitting}
            className={`record-submit-featured-btn ${
              isFeatured
                ? "record-submit-featured-btn-starred-active"
                : "record-submit-featured-btn-starred-inactive"
            }`}
          >
            <Star />
            <div className="record-submit-featured-btn-content">
              <div className="record-submit-featured-btn-title">
                Избранная запись
              </div>
              <div className="record-submit-featured-btn-desc">
                Выделить особым образом
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className="record-submit-actions">
        <button
          type="submit"
          disabled={isUploading || isSubmitting}
          className="record-submit-save"
        >
          <Save />
          <span>{isSubmitting ? "Сохранение..." : "Сохранить запись"}</span>
        </button>

        <button
          type="button"
          onClick={handleCancelWithConfirm}
          disabled={isUploading || isSubmitting}
          className="record-submit-cancel"
        >
          Отмена
        </button>
      </div>
    </>
  );
};
