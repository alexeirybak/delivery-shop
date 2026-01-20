"use client";

import { useState } from "react"; // Импортируем useState
import { ImageSection } from "../../../_components/ImageSection";
import { useArticleStore } from "@/store/articleStore";
import { CategorySelect } from "./CategorySelect";
import { ArticleFormFields } from "./ArticleFormFields";
import { ArticleSubmitSection } from "./ArticleSubmitSection";
import { ArticleFormProps, ArticleFormField, ArticleFormData } from "../../types";
import { TiptapEditor } from "./tiptap-components/TiptapEditor";
import { useCategoryStore } from "@/store/categoryStore";

export const ArticleForm = ({
  onFieldChange,
  onGenerateSlug,
  onSaveImageFile,
  onRemoveImage,
  onSubmit,
  onCancel,
}: ArticleFormProps) => {
  const { categories } = useCategoryStore();
  const { formData, setIsUploading, resetFormData } = useArticleStore(); // Добавляем resetFormData
  const [editorKey, setEditorKey] = useState(0); // Добавляем состояние для ключа

  const charCount = {
    name: formData.name.length,
    slug: formData.slug.length,
    description: formData.description.length,
    keywords: formData.keywords.length,
    imageAlt: formData.imageAlt.length,
  };

  const handleInputChange = (
    field: keyof ArticleFormData,
    value: string,
    maxLength?: number,
  ) => {
    if (field === "content") {
      onFieldChange(field as ArticleFormField, value);
      return;
    }
    if (value.length <= maxLength!) {
      onFieldChange(field as ArticleFormField, value);
    }
  };

  const handleCategoryChange = (
    categoryId: string,
    categoryName: string,
    categorySlug: string,
  ) => {
    onFieldChange("categoryId", categoryId);
    onFieldChange("categoryName", categoryName);
    onFieldChange("categorySlug", categorySlug);
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

  // Новая функция для обработки успешной отправки
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      onSubmit(e);
      
      // Если onSubmit успешен, сбрасываем форму
      resetFormData();
      setEditorKey(prev => prev + 1); // Увеличиваем ключ - редактор пересоздастся
      
      // Опционально: показываем уведомление
      // alert("Статья успешно создана!");
    } catch (error) {
      console.error("Ошибка при создании статьи:", error);
    }
  };

  return (
    <div className="mb-8 bg-white rounded shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Создание новой статьи</h2>
      <form onSubmit={handleFormSubmit}> {/* Используем новую обработку */}
        {categories.length > 0 && (
          <div className="mb-6 bg-gray-50 p-4 rounded border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Категория статьи *</h3>
            <CategorySelect
              value={formData.categoryId || ""}
              onChange={handleCategoryChange}
            />
          </div>
        )}

        <div className="mb-6">
          <ArticleFormFields
            charCount={charCount}
            onInputChange={handleInputChange}
            onGenerateSlug={handleGenerateSlug}
          />
        </div>

        <div className="mb-6">
          <ImageSection
            type="article"
            charCount={charCount}
            onInputChange={handleInputChange}
            onFileChange={handleFileChange}
            onRemoveImage={onRemoveImage}
          />
        </div>

        <div className="mb-6 bg-gray-50 p-4 rounded border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Текст статьи *</h3>
          <TiptapEditor
            key={`editor-${editorKey}`} // Используем ключ для управления ререндером
            content={formData.content || ""}
            onContentChange={(content) => handleInputChange("content", content)}
          />
        </div>

        <ArticleSubmitSection onCancel={onCancel} />
      </form>
    </div>
  );
};