import { CharCount } from "../../types/form/form.types";
import { CategoryFormField, CategoryFormProps } from "../types";
import { CategoryFormFields } from "./CategoryFormFields";
import { ImageSection } from "../../_components/ImageSection";
import { CategorySubmitSection } from "./CategorySubmitSection";
import { useCategoryStore } from "@/store/categoryStore";

export const CategoryForm = ({
  errors,
  onFieldChange,
  onGenerateSlug,
  onSaveImageFile,
  onRemoveImage,
  onSubmit,
  onCancel,
}: CategoryFormProps) => {
  const { setIsUploading, formData } = useCategoryStore();

  const charCount: CharCount = {
    name: formData.name.length,
    slug: formData.slug.length,
    description: formData.description.length,
    keywords: formData.keywords.length,
    imageAlt: formData.imageAlt.length,
  };

  const handleInputChange = (
    field: string,
    value: string,
    maxLength: number
  ) => {
    if (value.length <= maxLength) {
      onFieldChange(field as CategoryFormField, value);
    }
  };

  const handleGenerateSlug = () => {
    onGenerateSlug();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Размер файла не должен превышать 5MB");
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
    <div className="mb-8 bg-white rounded shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Создание новой категории</h2>
      <form onSubmit={onSubmit}>
        <ImageSection
          type="category"
          errors={errors}
          charCount={charCount}
          onInputChange={handleInputChange}
          onFileChange={handleFileChange}
          onRemoveImage={onRemoveImage}
        />
        <CategoryFormFields
          errors={errors}
          charCount={charCount}
          onInputChange={handleInputChange}
          onGenerateSlug={handleGenerateSlug}
        />
        <CategorySubmitSection onCancel={onCancel} />
      </form>
    </div>
  );
};