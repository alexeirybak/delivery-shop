"use client";

import { useAuthStore } from "@/store/authStore";
import { Header } from "../_components/Header";
import { SEORecommendations } from "../_components/SEORecommendations";
import { useCategoryFormState } from "./hooks/useCategoryFormState";
import { useCategoryFormValidation } from "./hooks/useCategoryFormValidation";
import { categorySeoRecommendations } from "../utils/recommendations";
import { CategoryTable } from "./_components/CategoryTable";
import { useEffect, useState } from "react";
import { useCategories } from "./hooks/useCategories";
import { Notification } from "../_components/Notification";
import { WarningAlert } from "./_components/WarningAlert";
import { HeaderActions } from "./_components/HeaderActions";
import { useCategoryStore } from "@/store/categoryStore";
import { Pagination } from "../_components/Pagination";
import { ItemsPerPageSelector } from "./_components/ItemsPerPageSelector";
import { Category } from "./types";
import { ReorderStatus } from "./_components/ReorderStatus";
import { CategoryForm } from "./_components/CategoryForm";

const CategoriesPage = () => {
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const { user } = useAuthStore();
  const author = `${user?.surname} ${user?.name}`.trim() || "Неизвестен";
  const {
    categories,
    totalAllItems,
    editingId,
    showForm,
    originalImageUrl,
    formData,
    setIsSubmitting,
    updateFormField,
    totalPages,
    currentPage,
    itemsPerPage,
    setItemsPerPage,
    setCurrentPage,
    setIsReordering,
  } = useCategoryStore();

  const {
    createCategory,
    deleteCategory,
    updateCategory,
    loadCategories,
    reorderCategories,
  } = useCategories();

  const {
    generateSlug,
    saveImageFile,
    removeImage,
    uploadImageToServer,
    getKeywordsArray,
    deleteOldImage,
    startCreate,
    startEdit,
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

  useEffect(() => {
    loadCategories({ page: currentPage });
  }, [currentPage, loadCategories]);

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

  const handleReorder = async (reorderedCategories: Category[]) => {
    setIsReordering(true);

    try {
      const dataForApi = reorderedCategories.map((category) => ({
        _id: category._id.toString(),
        numericId: category.numericId || 0,
      }));

      const result = await reorderCategories(dataForApi);

      if (result.success) {
        setNotification({
          type: "success",
          message: "Порядок категорий успешно обновлен",
        });
      } else {
        setNotification({
          type: "error",
          message: result.message || "Ошибка обновления порядка",
        });
      }
    } catch (error) {
      console.error("Ошибка:", error);
      setNotification({
        type: "error",
        message: "Произошла ошибка при обновлении порядка",
      });
    } finally {
      setIsReordering(false);
    }
  };

  const handleItemsPerPageChange = (perPage: number) => {
    setItemsPerPage(perPage);
    setCurrentPage(1);
    loadCategories({ page: 1 });
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
      <div className="mb-4">
        <ItemsPerPageSelector
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
        />
        <div className="text-sm text-gray-500 mt-1">
          Текущие параметры: страница {currentPage}, элементов: {itemsPerPage}
        </div>
      </div>
      <ReorderStatus />
      <WarningAlert />
      {showForm && (
        <CategoryForm
          errors={errors}
          onFieldChange={updateFormField}
          onGenerateSlug={generateSlug}
          onSaveImageFile={saveImageFile}
          onRemoveImage={removeImage}
          onSubmit={editingId ? handleUpdate : handleCreate}
          onCancel={resetForm}         />
      )}

      <CategoryTable
        onDelete={handleDelete}
        onEdit={startEdit}
        onReorder={handleReorder}
      />
      {totalPages > 1 && <Pagination />}
      <SEORecommendations recommendations={categorySeoRecommendations} />
    </div>
  );
};

export default CategoriesPage;
