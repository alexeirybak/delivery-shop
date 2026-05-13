import { useCategoryStore } from "@/store/categoryStore";
import { CategoryFormFieldsProps } from "../../records/types/categories/categories.types";
import "../styles/category-form-fields.css";

export const CategoryFormFields = ({
  onInputChange,
}: CategoryFormFieldsProps) => {
  const { isSubmitting, formData } = useCategoryStore();
  return (
    <div className="category-form-fields">
      <div className="category-form-field">
        <div className="category-form-field-label">
          <span>
            Название тетради <span className="required">*</span>
          </span>
        </div>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onInputChange("name", e.target.value)}
          required
          disabled={isSubmitting}
          placeholder="Например: Математика"
          className="category-form-input"
        />
      </div>
      <div className="category-form-field category-form-field-full">
        <div className="category-form-field-label">
          <span>Описание</span>
        </div>
        <textarea
          value={formData.description}
          onChange={(e) => onInputChange("description", e.target.value)}
          rows={3}
          disabled={isSubmitting}
          placeholder="Описание тетради"
          className="category-form-textarea"
        />
      </div>
    </div>
  );
};
