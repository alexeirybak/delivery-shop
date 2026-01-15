"use client";

import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { Header } from "../../_components/Header";
import { Notification } from "../../_components/Notification";
import { articleSeoRecommendations } from "../../utils/recommendations";
import { SEORecommendations } from "../../_components/SEORecommendations";
import { useArticleStore } from "@/store/articleStore";
import { useArticleFormState } from "../hooks/useArticleFormState";
import { useArticles } from "../hooks/useArticles";
import { ArticleForm } from "./_components/ArticleForm";
import { useCategoryStore } from "@/store/categoryStore";

const EditorPage = () => {
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const { user } = useAuthStore();
  const author = `${user?.surname} ${user?.name}`.trim() || "Неизвестен";

  const { updateFormField, setIsSubmitting, formData } = useArticleStore();
  const { createArticle } = useArticles();
  const { categories, loadCategories } = useCategoryStore();

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

  const {
    generateSlug,
    saveImageFile,
    removeImage,
    uploadImageToServer,
    getKeywordsArray,
    resetForm,
  } = useArticleFormState();

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

  console.log(formData);

  return (
    <div className="relative">
      <Header title="Редактор статей" description="Создание статей" />
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <ArticleForm
        onFieldChangeAction={updateFormField}
        onGenerateSlugAction={generateSlug}
        onSaveImageFileAction={saveImageFile}
        onRemoveImageAction={removeImage}
        onSubmitAction={handleCreate}
        onCancelAction={() => {
          if (
            confirm("Вы уверены? Все несохраненные изменения будут потеряны.")
          ) {
            resetForm();
          }
        }}
        categories={categories}
      />

      <SEORecommendations recommendations={articleSeoRecommendations} />
    </div>
  );
};

export default EditorPage;
