import { ImageSection } from "../../workbook/_components/ImageSection";
import { CategoryFormField } from "../types";
import { CategoryFormFields } from "./CategoryFormFields";
import { CategorySubmitSection } from "./CategorySubmitSection";
import { useCategoryStore } from "@/store/categoryStore";
import "../styles/category-form.css";
import { CategoryFormProps } from "../../records/types/categories/categories.types";

export const CategoryForm = ({
  onFieldChange,
  onSaveImageFile,
  onRemoveImage,
  onSubmit,
  onCancel,
}: CategoryFormProps) => {
  const { setIsUploading } = useCategoryStore();

  const handleInputChange = (field: string, value: string) => {
    onFieldChange(field as CategoryFormField, value);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("Размер файла не должен превышать 1MB");
      return;
    }

    setIsUploading(true);

    try {
      onSaveImageFile(file);
    } catch (error) {
      console.error("Ошибка при выборе изображения:", error);
      alert("Ошибка при выборе изображения");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="category-form">
      <h2 className="category-form-title">Создание новой тетради</h2>
      <form onSubmit={onSubmit}>
        <ImageSection
          type="category"
          onInputChange={handleInputChange}
          onFileChange={handleFileChange}
          onRemoveImage={onRemoveImage}
        />
        <CategoryFormFields onInputChange={handleInputChange} />
        <CategorySubmitSection onCancel={onCancel} />
      </form>
    </div>
  );
};
