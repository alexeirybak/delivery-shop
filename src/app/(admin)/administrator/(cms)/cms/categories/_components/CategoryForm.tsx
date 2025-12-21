import { CategoryFormProps, FormField } from "../../types";
import { useState } from "react";
import { ImageSection } from "./ImageSection";
import { FormFields } from "./FormFields";
import { SubmitSection } from "./SubmitSection";

interface CharCount {
  name: number;
  description: number;
  keywords: number;
  imageAlt: number;
}

export const CategoryForm = ({
  formData,
  errors,
  editingId,
  isSubmitting,
  onFieldChange,
  onGenerateSlug,
  onSaveImageFile,
  onRemoveImage, 
  onSubmit,
  onCancel,
}: CategoryFormProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const charCount: CharCount = {
    name: formData.name.length,
    description: formData.description.length,
    keywords: formData.keywords.length,
    imageAlt: (formData.imageAlt || "").length,
  };

  const handleInputChange = (
    field: FormField,
    value: string,
    maxLength: number
  ) => {
    if (value.length <= maxLength) {
      onFieldChange(field, value);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      alert("Пожалуйста, выберите изображение в формате JPG, PNG, GIF или WebP");
      return;
    }

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
      <h2 className="text-xl font-semibold mb-4">
        {editingId ? "Редактирование категории" : "Создание новой категории"}
      </h2>

      <form onSubmit={onSubmit}>
        <ImageSection
          formData={formData}
          isUploading={isUploading}
          isSubmitting={isSubmitting}
          editingId={editingId}
          charCount={charCount}
          onRemoveImage={onRemoveImage}
          onFileChange={handleFileChange}
          onInputChange={handleInputChange}
        />

        <FormFields
          formData={formData}
          errors={errors}
          isSubmitting={isSubmitting}
          charCount={charCount}
          onInputChange={handleInputChange}
          onGenerateSlug={onGenerateSlug}
        />

        <SubmitSection
          isSubmitting={isSubmitting}
          editingId={editingId}
          isUploading={isUploading}
          onCancel={onCancel}
        />
      </form>
    </div>
  );
};