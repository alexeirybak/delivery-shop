"use client";

import { useEffect, useState } from "react";
import Header from "../_components/Header";
import { useCategories } from "../hooks/useCategories";
import { useCategoryFormState } from "../hooks/useCategoryFormState";
import { useCategoryFormValidation } from "../hooks/useCategoryFormValidation";
import { useAuthStore } from "@/store/authStore";
import { Category } from "../types";
import { HeaderActions } from "./_components/HeaderActions";
import { ReorderStatus } from "./_components/ReorderStatus";
import { WarningAlert } from "./_components/WarningAlert";
import { CategoryForm } from "./_components/CategoryForm";
import { CategoryTable } from "./_components/CategoryTable";
import { Notification } from "./_components/Notification";
import SEORecommendations from "../_components/SEORecommendations";
import { categorySeoRecommendations } from "../utils/recommendations";
import { Pagination } from "../../../blog/_CMSComponents/Pagination";
import { ItemsPerPageSelector } from "./_components/ItemsPerPageSelector";

export default function CategoriesPage() {
  const { user } = useAuthStore();
  const author = `${user?.surname} ${user?.name}`.trim() || "Неизвестен";

  const {
    categories,
    loading,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    filterType,
    sortField,
    sortDirection,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    setCurrentPage,
    setItemsPerPage,
    setFilterType,
    setSortField,
    setSortDirection,
    loadCategories,
  } = useCategories();

  const {
    showForm,
    editingId,
    formData,
    originalImageUrl,
    startCreate,
    startEdit,
    resetForm,
    updateFormField,
    generateSlug,
    getKeywordsArray,
    saveImageFile,
    removeImage,
    uploadImageToServer,
    deleteOldImage,
  } = useCategoryFormState();

  const { errors, validateForm } = useCategoryFormValidation();
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      await loadCategories({
        page: 1,
        search: searchQuery,
      });
      setCurrentPage(1);
    } finally {
      setIsSearching(false);
    }
  };

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

      // 2. Создаем данные для API
      const categoryData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        image: finalImageUrl, // Используем только URL после загрузки
        imageAlt: formData.imageAlt,
        keywords: getKeywordsArray(),
        numericId: null,
        author,
      };

      // 3. Отправляем запрос
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
          console.log("Старое изображение удалено");
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (perPage: number) => {
    setItemsPerPage(perPage);
  };

  return (
    <div className="relative">
      <Header
        title="Управление категориями"
        description={`Всего категорий: ${totalItems}`}
      />

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <HeaderActions isReordering={isReordering} onCreate={startCreate} />

      <div className="mb-4">
        <ItemsPerPageSelector
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
        />
        <div className="text-xs text-gray-500 mt-1">
          Текущие параметры: страница {currentPage}, элементов: {itemsPerPage}
        </div>
      </div>

      <ReorderStatus isReordering={isReordering} />

      <WarningAlert />

      {showForm && (
        <CategoryForm
          formData={formData}
          errors={errors}
          editingId={editingId}
          isSubmitting={isSubmitting}
          onFieldChange={updateFormField}
          onGenerateSlug={generateSlug}
          onSubmit={editingId ? handleUpdate : handleCreate}
          onCancel={resetForm}
          onSaveImageFile={saveImageFile}
          onRemoveImage={removeImage}
        />
      )}

      <CategoryTable
        categories={categories}
        loading={loading || isReordering}
        onEdit={startEdit}
        onDelete={handleDelete}
        onReorder={handleReorder}
        searchQuery={searchQuery}
        filterType={filterType}
        sortField={sortField}
        sortDirection={sortDirection}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        totalItems={totalItems}
        onFilterTypeChange={setFilterType}
        onSortFieldChange={setSortField}
        onSortDirectionChange={setSortDirection}
        isSearching={isSearching}
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChangeAction={handlePageChange}
        />
      )}

      <SEORecommendations recommendations={categorySeoRecommendations} />
    </div>
  );
}
