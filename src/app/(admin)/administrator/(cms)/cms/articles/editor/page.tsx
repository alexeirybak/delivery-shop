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
import { ChevronUp } from "lucide-react";

const EditorPage = () => {
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const { user } = useAuthStore();

  const author = `${user?.surname} ${user?.name}`.trim() || "Неизвестен";

  const { formData, setIsSubmitting, updateFormField } = useArticleStore();

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

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 800);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 800,
      behavior: "smooth",
    });
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
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 cursor-pointer duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default EditorPage;
