"use client";

import { useAuthStore } from "@/store/authStore";
import { Header } from "../_components/Header";
import { SEORecommendations } from "../_components/SEORecommendations";
import { useCategoryFormState } from "../hooks/useCategoryFormState";
import { useCategoryFormValidation } from "../hooks/useCategoryFormValidation";
import { categorySeoRecommendations } from "../utils/recommendations";
import CategoryForm from "./_components/CategoryForm";
import CategoryTable from "./_components/CategoryTable";
import { useEffect, useState } from "react";
import { useCategories } from "../hooks/useCategories";
import { Notification } from "./_components/Notification";
import { WarningAlert } from "./_components/WarningAlert";

const CategoriesPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const { user } = useAuthStore();
  const author = `${user?.surname} ${user?.name}`.trim() || "Неизвестен";

  const { loading, createCategory } = useCategories();

  const {
    formData,
    updateFormField,
    generateSlug,
    saveImageFile,
    removeImage,
    uploadImageToServer,
    getKeywordsArray,
    resetForm,
  } = useCategoryFormState();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const { errors, validateForm } = useCategoryFormValidation();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm(formData)) {
      setNotification({
        type: "error",
        message: "Пожалуйста, исправьте ошибки в форме",
      });
      setIsSubmitting(false);
      return;
    }

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

      const categoryData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        keywords: getKeywordsArray(),
        image: finalImageUrl,
        imageAlt: formData.imageAlt,
        numericId: null,
        author,
      };

      const createResult = await createCategory(categoryData);

      if (createResult.success) {
        setNotification({
          type: "success",
          message: "Категория успешно создана",
        });
        resetForm();
      } else {
        setNotification({
          type: "error",
          message: createResult.message || "Ошибка создания категории",
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
      <Header
        title="Управление категориями"
        description={`Всего категорий: ${"????"}`}
      />
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <WarningAlert />
      <CategoryForm
        formData={formData}
        errors={errors}
        isSubmitting={isSubmitting}
        onFieldChange={updateFormField}
        onGenerateSlug={generateSlug}
        onSaveImageFile={saveImageFile}
        onRemoveImage={removeImage}
        onSubmit={handleCreate}
        onCancel={resetForm}
      />
      <CategoryTable />
      <SEORecommendations recommendations={categorySeoRecommendations} />
    </div>
  );
};

export default CategoriesPage;
