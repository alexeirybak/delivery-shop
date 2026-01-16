"use client";

import { useEffect, useState } from "react";
import { SEORecommendations } from "../../_components/SEORecommendations";
import { useAuthStore } from "@/store/authStore";
import { Header } from "../../_components/Header";
import { Notification } from "../../_components/Notification";
import { articleSeoRecommendations } from "../../utils/recommendations";
import { useArticleStore } from "@/store/articleStore";
import { useCategoryStore } from "@/store/categoryStore";
import { useArticles } from "../hooks/useArticles";
import { useArticleFormState } from "../hooks/useArticleFormState";
import { ArticleForm } from "./_components/ArticleForm";

const EditorPage = () => {
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const { user } = useAuthStore();

  const author = `${user?.surname} ${user?.name}`.trim() || "Неизвестен";

  const { formData, setIsSubmitting, updateFormField } = useArticleStore();

  console.log(formData);
  const { createArticle } = useArticles();
  const {
    generateSlug,
    saveImageFile,
    removeImage,
    uploadImageToServer,
    getKeywordsArray,
    resetForm,
  } = useArticleFormState();
  const { loadCategories } = useCategoryStore();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        await loadCategories();
      } catch (error) {
        console.error("Ошибка загрузки категорий:", error);
      }
    };
    fetchCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalImageUrl = "";
      if (formData.image && formData.image.startsWith("blob:")) {
        try {
          const uploadResult = await uploadImageToServer();
          if (uploadResult) {
            finalImageUrl = uploadResult.url;
          } else {
            throw new Error("Не удалось загрузить изображение");
          }
        } catch (uploadError) {
          console.error("Ошибка загрузки изображения:", uploadError);
          setNotification({
            type: "error",
            message: "Не удалось загрузить изображение",
          });
          setIsSubmitting(false);
          return;
        }
      }

      const articleData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        keywords: getKeywordsArray(),
        image: finalImageUrl,
        imageAlt: formData.imageAlt,
        numericId: null,
        author,
        categoryId: formData.categoryId,
        categoryName: formData.categoryName,
        categorySlug: formData.categorySlug,
        content: formData.content || "",
        status: formData.status || "draft",
        isFeatured: formData.isFeatured || false,
        views: 0,
      };

      const createResult = await createArticle(articleData);

      if (createResult.success) {
        setNotification({
          type: "success",
          message: "Статья успешно создана",
        });
        resetForm();
      } else {
        setNotification({
          type: "error",
          message: createResult.message || "Ошибка создания статьи",
        });
      }
    } catch (error) {
      console.error("Неожиданная ошибка:", error);
      setNotification({
        type: "error",
        message: "Произошла непредвиденная ошибка",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <Header title="Текстовый редактор" description="Создание статей" />
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <ArticleForm
        onFieldChange={updateFormField}
        onGenerateSlug={generateSlug}
        onSaveImageFile={saveImageFile}
        onRemoveImage={removeImage}
        onSubmit={handleCreate}
        onCancel={resetForm}
      />

      <SEORecommendations recommendations={articleSeoRecommendations} />
    </div>
  );
};

export default EditorPage;
