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
import { useSearchParams } from "next/navigation";
import { Loader } from "@/components/Loader";

const EditorPage = () => {
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const { user } = useAuthStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    const articleId = searchParams?.get("id");
    if (articleId) {
      setCurrentArticleId(articleId);
    }
  }, [searchParams]);

  const author = `${user?.surname} ${user?.name}`.trim() || "Неизвестен";

  const {
    formData,
    setIsSubmitting,
    updateFormField,
    setArticleData,
    resetFormData,
  } = useArticleStore();

  const { createArticle, getArticle } = useArticles();

  useEffect(() => {
    const loadArticle = async () => {
      const articleId = searchParams?.get("id");

      if (articleId) {
        setIsLoading(true);
        setCurrentArticleId(articleId);

        try {
          const result = await getArticle(articleId);

          if (result.success && result.data) {
            setArticleData(result.data);
          } else {
            setNotification({
              type: "error",
              message: result.message || "Не удалось загрузить статью",
            });
          }
        } catch (error) {
          console.error("Ошибка загрузки статьи:", error);
          setNotification({
            type: "error",
            message: "Ошибка загрузки статьи",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        resetFormData();
      }
    };

    loadArticle();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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
        await loadCategories({ unlimited: true });
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

      const articleId = currentArticleId || undefined;

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
        _id: articleId,
      };

      const createResult = await createArticle(articleData);

      if (createResult.success) {
        if (createResult.data?._id && !currentArticleId) {
          setCurrentArticleId(createResult.data?._id);
        }
        setNotification({
          type: "success",
          message: currentArticleId
            ? "Изменения сохранены"
            : "Статья успешно создана",
        });
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
      window.scroll({ top: 0, behavior: "smooth" });
    }
  };

  if (isLoading) return <Loader />;

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
