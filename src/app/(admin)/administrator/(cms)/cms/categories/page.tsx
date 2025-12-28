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
import { HeaderActions } from "./_components/HeaderActions";

const CategoriesPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const { user } = useAuthStore();
  const author = `${user?.surname} ${user?.name}`.trim() || "Неизвестен";

  const {
    categories,
    loading,
    totalAllItems,
    createCategory,
    deleteCategory,
    updateCategory,
  } = useCategories();

  const {
    formData,
    showForm,
    editingId,
    originalImageUrl,
    updateFormField,
    generateSlug,
    saveImageFile,
    removeImage,
    uploadImageToServer,
    getKeywordsArray,
    resetForm,
    deleteOldImage,
    startCreate,
    startEdit,
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    setIsSubmitting(true);

    if (!validateForm(formData)) {
      console.error("Ошибки валидации формы");
      setNotification({
        type: "error",
        message: "Пожалуйста, исправьте ошибки в форме",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      let finalImageUrl = formData.image;
      let shouldDeleteOldImage = false;

      if (formData.image && formData.image.startsWith("blob:")) {
        try {
          const uploadResult = await uploadImageToServer();

          if (uploadResult) {
            finalImageUrl = uploadResult.url;
            shouldDeleteOldImage = true;
          } else {
            throw new Error("Не удалось загрузить изображение");
          }
        } catch (uploadError) {
          console.error("Ошибка загрузки изображения:", uploadError);
          setNotification({
            type: "error",
            message: "Не удалось загрузить изображение. Попробуйте еще раз.",
          });
          setIsSubmitting(false);
          return;
        }
      } else if (!formData.image && originalImageUrl) {
        shouldDeleteOldImage = true;
      }

      if (shouldDeleteOldImage && originalImageUrl) {
        const deleteSuccess = await deleteOldImage(originalImageUrl);
        if (deleteSuccess) {
          console.warn("Старое изображение удалено");
        } else {
          console.warn("Не удалось удалить старое изображение");
        }
      }

      const updateData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        image: finalImageUrl,
        imageAlt: formData.imageAlt,
        keywords: getKeywordsArray(),
      };

      const result = await updateCategory(editingId, updateData);

      if (result.success) {
        setNotification({
          type: "success",
          message: "Категория успешно обновлена",
        });
        resetForm();
      } else {
        console.error("Ошибка обновления категории:", result.message);
        setNotification({
          type: "error",
          message: result.message || "Ошибка обновления категории",
        });
      }
    } catch (error) {
      console.error("Неожиданная ошибка:", error);
      setNotification({
        type: "error",
        message: "Произошла ошибка при обновлении категории",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту категорию?")) return;

    const categoryToDelete = categories.find((c) => c._id.toString() === id);

    const result = await deleteCategory(id);
    if (result.success) {
      if (categoryToDelete?.image) {
        try {
          await deleteOldImage(categoryToDelete.image);
        } catch (error) {
          console.error("Не удалось удалить изображение категории:", error);
        }
      }

      setNotification({
        type: "success",
        message: "Категория успешно удалена",
      });
    } else {
      setNotification({
        type: "error",
        message: result.message || "Ошибка удаления категории",
      });
    }
  };

  return (
    <div className="relative">
      <Header
        title="Управление категориями"
        description={`Всего категорий: ${totalAllItems}`}
      />
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <HeaderActions onCreate={startCreate} />
      <WarningAlert />
      {showForm && (
        <CategoryForm
          formData={formData}
          errors={errors}
          isSubmitting={isSubmitting}
          editingId={editingId}
          onFieldChange={updateFormField}
          onGenerateSlug={generateSlug}
          onSaveImageFile={saveImageFile}
          onRemoveImage={removeImage}
          onSubmit={editingId ? handleUpdate : handleCreate}
          onCancel={resetForm}
        />
      )}

      <CategoryTable
        categories={categories}
        loading={loading}
        onDelete={handleDelete}
        onEdit={startEdit}
      />
      <SEORecommendations recommendations={categorySeoRecommendations} />
    </div>
  );
};

export default CategoriesPage;
