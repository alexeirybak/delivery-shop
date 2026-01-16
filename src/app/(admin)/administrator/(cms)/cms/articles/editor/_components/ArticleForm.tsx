import { CharCount } from "../../../types/form/form.types";
import { ArticleFormField, ArticleFormProps } from "../../types";
import { ImageSection } from "../../../_components/ImageSection";
import { ArticleFormFields } from "./ArticleFormFields";
import { useArticleStore } from "@/store/articleStore";
import { useCategoryStore } from "@/store/categoryStore";
import { CategorySelect } from "./CategorySelect";
import { ArticleSubmitSection } from "./ArticleSubmitSection";

export const ArticleForm = ({
  onFieldChange,
  onGenerateSlug,
  onSaveImageFile,
  onRemoveImage,
  onSubmit,
  onCancel,
}: ArticleFormProps) => {
  const { setIsUploading, formData } = useArticleStore();
  const { categories } = useCategoryStore();

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
      onFieldChange(field as ArticleFormField, value);
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

  const handleCategoryChange = (
    categoryId: string,
    categoryName: string,
    categorySlug: string
  ) => {
    onFieldChange("categoryId", categoryId);
    onFieldChange("categoryName", categoryName);
    onFieldChange("categorySlug", categorySlug);
  };

  return (
    <div className="mb-8 bg-white rounded shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Создание новой статьи</h2>
      <ImageSection
        type="article"
        charCount={charCount}
        onInputChange={handleInputChange}
        onFileChange={handleFileChange}
        onRemoveImage={onRemoveImage}
      />
      <form onSubmit={onSubmit}>
        {categories.length > 0 && (
          <div className="mb-6 bg-gray-50 p-4 rounded border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Категория статьи *</h3>
            <CategorySelect
              value={formData.categoryId || ""}
              onChange={handleCategoryChange}
            />
          </div>
        )}
        <ArticleFormFields
          charCount={charCount}
          onInputChange={handleInputChange}
          onGenerateSlug={handleGenerateSlug}
        />
        <ArticleSubmitSection onCancel={onCancel}/>
      </form>
    </div>
  );
};
