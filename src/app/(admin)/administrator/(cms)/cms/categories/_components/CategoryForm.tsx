import { CategoryFormProps, CharCount, FormField } from "../../types";
import { useState } from "react";
import { ImageSection } from "./ImageSection";
import { FormFields } from "./FormFields";
import { SubmitSection } from "./SubmitSection";

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
    slug: formData.slug.length,
    description: formData.description.length,
    keywords: formData.keywords.length,
    imageAlt: formData.imageAlt.length,
  };

  // Исправленный обработчик - убираем очистку здесь
  const handleInputChange = (
    field: FormField,
    value: string,
    maxLength: number
  ) => {
    if (value.length <= maxLength) {
      onFieldChange(field, value);
    }
  };

  // Генерация slug БЕЗ очистки - оставляем как было
  const handleGenerateSlug = () => {
    onGenerateSlug();
  };

  // Обработчик файлов (без изменений)
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
      alert(
        "Пожалуйста, выберите изображение в формате JPG, PNG, GIF или WebP"
      );
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
          errors={errors}
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
          onGenerateSlug={handleGenerateSlug}
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
