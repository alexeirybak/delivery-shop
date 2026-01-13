"use client";

import { ImageSection } from "../../../_components/ImageSection";
import { useArticleStore } from "@/store/articleStore";
import { CategorySelect } from "./CategorySelect";
import { ArticleFormFields } from "./ArticleFormFields";
import { SubmitSection } from "./SubmitSection";
import { ArticleFormProps, ArticleFormField } from "../../types/form";
import { TiptapEditor } from "./tiptap-components/TiptapEditor";
import { ArticleFormData } from "@/app/(admin)/administrator/(cms)/cms/articles/types/form/article-form.types";

export const ArticleForm = ({
  onFieldChangeAction,
  onGenerateSlugAction,
  onSaveImageFileAction,
  onRemoveImageAction,
  onSubmitAction,
  onCancelAction,
  categories = [],
}: ArticleFormProps) => {
  const { formData, setIsUploading } = useArticleStore();

  const charCount = {
    name: formData.name.length,
    slug: formData.slug.length,
    description: formData.description.length,
    keywords: formData.keywords.length,
    imageAlt: formData.imageAlt.length,
  };

  // Универсальный обработчик изменения полей
  const handleFieldChange = (
    field: keyof ArticleFormData,
    value: string,
    maxLength?: number
  ) => {
    if (maxLength !== undefined && value.length > maxLength) {
      return;
    }
    onFieldChangeAction(field as ArticleFormField, value);
  };

  // Обработчик для категории
  const handleCategoryChange = (
    categoryId: string,
    categoryName: string,
    categorySlug: string
  ) => {
    onFieldChangeAction("categoryId", categoryId);
    onFieldChangeAction("categoryName", categoryName);
    onFieldChangeAction("categorySlug", categorySlug);
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
      onSaveImageFileAction(file);
    } catch (error) {
      console.error("Ошибка при выборе изображения:", error);
      alert("Ошибка при выборе изображения");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-8 bg-white rounded shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Создание новой статьи</h2>
      <form onSubmit={onSubmitAction}>
        {/* Категория */}
        {categories.length > 0 && (
          <div className="mb-6 bg-gray-50 p-4 rounded border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Категория статьи *</h3>
            <CategorySelect
              categories={categories}
              value={formData.categoryId || ""}
              onChangeAction={handleCategoryChange}
            />
          </div>
        )}

        {/* Основные поля */}
        <div className="mb-6">
          <ArticleFormFields
            charCount={charCount}
            onInputChange={handleFieldChange}
            onGenerateSlug={onGenerateSlugAction}
          />
        </div>

        {/* Изображение статьи */}
        <div className="mb-6">
          <ImageSection
            type="article"
            charCount={charCount}
            onInputChange={handleFieldChange}
            onFileChange={handleFileChange}
            onRemoveImage={onRemoveImageAction}
          />
        </div>

        {/* Редактор статьи */}
        <div className="mb-6 bg-gray-50 p-4 rounded border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Текст статьи *</h3>
          <TiptapEditor
            key={formData._id || "new-article"}
            content={formData.content || ""}
            onContentChangeAction={(content) =>
              handleFieldChange("content", content)
            }
          />
        </div>

        <SubmitSection onCancel={onCancelAction} />
      </form>
    </div>
  );
};