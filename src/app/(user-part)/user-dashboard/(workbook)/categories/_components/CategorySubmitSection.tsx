import { useCategoryStore } from "@/store/categoryStore";
import { Save } from "lucide-react";
import { SubmitSectionProps } from "../types";
import "../styles/category-submit-section.css";
import { CyberLoader } from "../../../_components/CyberLoader";

export const CategorySubmitSection = ({ onCancel }: SubmitSectionProps) => {
  const { editingId, isSubmitting, isUploading } = useCategoryStore();
  return (
    <>
      {isSubmitting && (
        <div className="category-submit-loading">
          <div className="category-submit-loading-content">
            <CyberLoader />
            {editingId ? "Обновляем тетрадь" : "Создаем тетрадь..."}
          </div>
        </div>
      )}
      <div className="category-submit-buttons">
        <button
          type="submit"
          disabled={isUploading || isSubmitting}
          className="category-submit-btn"
        >
          <Save />
          {isSubmitting
            ? "Сохранение..."
            : editingId
              ? "Сохранить изменения"
              : "Создать тетрадь"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isUploading || isSubmitting}
          className="category-cancel-btn"
        >
          Отмена
        </button>
      </div>
    </>
  );
};
