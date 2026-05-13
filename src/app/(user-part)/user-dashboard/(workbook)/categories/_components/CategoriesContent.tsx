"use client";

import { useCategoryFormState } from "../hooks/useCategoryFormState";
import { CategoryTable } from "./CategoryTable";
import { useEffect, useState } from "react";
import { useCategories } from "../hooks/useCategories";
import { WarningAlert } from "./WarningAlert";
import { HeaderActions } from "./HeaderActions";
import { useCategoryStore } from "@/store/categoryStore";
import { ReorderStatus } from "./ReorderStatus";
import { CategoryForm } from "./CategoryForm";
import { ItemsPerPageSelector } from "../../workbook/_components/ItemsPerPageSelector";
import { Pagination } from "../../workbook/_components/Pagination";
import { Header } from "../../records/_components/Header";
import { Notification } from "../../workbook/_components/Notification";
import { Category } from "../../records/types/categories/categories.types";
import "./../styles/categories-page.css";

const CategoriesContent = () => {
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
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
    saveImageFile,
    removeImage,
    uploadImageToServer,
    deleteOldImage,
    startCreate,
    startEdit,
    resetForm,
  } = useCategoryFormState();

  useEffect(() => {
    if (notification) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      
      const timer = setTimeout(() => {
        setNotification(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    loadCategories({ page: currentPage });
  }, [currentPage, loadCategories]);

  const handleCreate = async (e: React.SyntheticEvent) => {
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

      const categoryData = {
        name: formData.name,
        description: formData.description,
        image: finalImageUrl,
        numericId: null,
      };

      const createResult = await createCategory(categoryData);

      if (createResult.success) {
        setNotification({
          type: "success",
          message: "Тетрадь успешно создана",
        });
        resetForm();
      } else {
        setNotification({
          type: "error",
          message: createResult.message || "Ошибка создания тетради",
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
        description: formData.description,
        image: finalImageUrl,
      };

      const result = await updateCategory(editingId, updateData);

      if (result.success) {
        setNotification({
          type: "success",
          message: "Тетрадь успешно обновлена",
        });
        resetForm();
      } else {
        console.error("Ошибка обновления тетради:", result.message);
        setNotification({
          type: "error",
          message: result.message || "Ошибка обновления тетради",
        });
      }
    } catch (error) {
      console.error("Неожиданная ошибка:", error);
      setNotification({
        type: "error",
        message: "Произошла ошибка при обновлении тетради",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту тетрадь?")) return;

    const categoryToDelete = categories.find((c) => c._id.toString() === id);

    const result = await deleteCategory(id);
    if (result.success) {
      if (categoryToDelete?.image) {
        try {
          await deleteOldImage(categoryToDelete.image);
        } catch (error) {
          console.error("Не удалось удалить изображение тетради:", error);
        }
      }

      setNotification({
        type: "success",
        message: "Тетрадь успешно удалена",
      });
    } else {
      setNotification({
        type: "error",
        message: result.message || "Ошибка удаления тетради",
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
          message: "Порядок тетрадей успешно обновлен",
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
    <div className="categories-page">
      <div className="categories-page-header">
        <Header
          title="Полка для тетрадей"
          description={`Всего тетрадей: ${totalAllItems}`}
        />
      </div>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <HeaderActions onCreate={startCreate} />
      <div className="categories-controls">
        <div className="items-per-page-wrapper">
          <ItemsPerPageSelector
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          />
        </div>
        <div className="items-per-page-info">
          Текущие параметры: страница {currentPage}, тетрадей: {itemsPerPage}
        </div>
      </div>
      <ReorderStatus />

      {showForm && (
        <CategoryForm
          onFieldChange={updateFormField}
          onSaveImageFile={saveImageFile}
          onRemoveImage={removeImage}
          onSubmit={editingId ? handleUpdate : handleCreate}
          onCancel={resetForm}
        />
      )}

      <CategoryTable
        onDelete={handleDelete}
        onEdit={startEdit}
        onReorder={handleReorder}
      />
      {totalPages > 1 && <Pagination type="categories" />}
      <WarningAlert />
    </div>
  );
};

export default CategoriesContent;