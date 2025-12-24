import { useState } from "react";
import { FormFields } from "./FormFields";
import ImageSection from "./ImageSection";
import SubmitSection from "./SubmitSection";

const CategoryForm = ({
  formData,
  errors,
  isSubmitting,
  onFieldChange,
  onGenerateSlug,
  onSaveImageFile,
  onRemoveImage,
  onSubmit,
  onCancel,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const charCount: CharCount = {
    name: formData.name.length,
    slug: formData.slug.length,
    description: formData.description.length,
    keywords: formData.keywords.length,
    imageAlt: formData.imageAlt.length,
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
          formData={formData}
          errors={errors}
          charCount={charCount}
          isUploading={isUploading}
          isSubmitting={isSubmitting}
          onInputChange={handleInputChange}
          onFileChange={handleFileChange}
          onRemoveImage={onRemoveImage}
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
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          isUploading={isUploading}
        />
      </form>
    </div>
  );
};

export default CategoryForm;
