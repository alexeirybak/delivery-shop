import { CategoryFormProps, CharCount, FormField } from "../../types";
import { ImageSection } from "./ImageSection";
import { FormFields } from "./FormFields";
import { SubmitSection } from "./SubmitSection";
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
  const { editingId, formData, setIsUploading } =
    useCategoryStore();

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

    // Убираем проверку типа файла - она теперь на уровне браузера
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
          charCount={charCount}
          onRemoveImage={onRemoveImage}
          onFileChange={handleFileChange}
          onInputChange={handleInputChange}
        />

        <FormFields
          errors={errors}
          charCount={charCount}
          onInputChange={handleInputChange}
          onGenerateSlug={handleGenerateSlug}
        />

        <SubmitSection onCancel={onCancel} />
      </form>
    </div>
  );
};
