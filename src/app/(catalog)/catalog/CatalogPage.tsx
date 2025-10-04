"use client";

import { CatalogProps } from "@/types/catalog";
import { useEffect, useState } from "react";
import ErrorComponent from "@/components/ErrorComponent";
import { Loader } from "@/components/Loader";
import CatalogAdminControls from "../CatalogAdminControls";
import CatalogGrid from "../CatalogGrid";
import { useAuthStore } from "@/store/authStore";

export const metadata = {
  title: 'Каталог товаров магазина "Северяночка"',
  description: 'Каталог всех товаров магазина "Северяночка"',
};

const CatalogPage = () => {
  const [categories, setCategories] = useState<CatalogProps[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [draggedCategory, setDraggedCategory] = useState<CatalogProps | null>(
    null
  );
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(
    null
  );
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  const isAdmin = user?.role === "admin";

  const fetchCategories = async () => {
    try {
      const response = await fetch("api/catalog");
      if (!response.ok)
        throw new Error(`Ошибка ответа сервера: ${response.status}`);

      const data: CatalogProps[] = await response.json();
      setCategories(data.sort((a, b) => a.order - b.order));
    } catch (error) {
      setError({
        error: error instanceof Error ? error : new Error("Неизвестная ошибка"),
        userMessage: "Не удалось загрузить каталог категорий",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const updateOrderInDB = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("api/catalog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          categories.map((category, index) => ({
            _id: category._id,
            order: index + 1,
            title: category.title,
            img: category.img,
            colSpan: category.colSpan,
            tabletColSpan: category.tabletColSpan,
            mobileColSpan: category.mobileColSpan,
          }))
        ),
      });

      if (!response.ok) throw new Error("Ошибка при обновлении порядка");

      await response.json();
    } catch (error) {
      setError({
        error: error instanceof Error ? error : new Error("Неизвестная ошибка"),
        userMessage: "Не удалось изменить порядок категорий",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleEditing = async () => {
    if (isEditing) {
      await updateOrderInDB();
    }
    setIsEditing(!isEditing);
  };

  const handleDragStart = (category: CatalogProps) => {
    if (isEditing) {
      setDraggedCategory(category);
    }
  };

  const handleDragOver = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    if (draggedCategory && draggedCategory._id !== categoryId) {
      setHoveredCategoryId(categoryId);
    }
  };

  const handleDragLeave = () => {
    setHoveredCategoryId(null);
  };

  const handleDrop = (e: React.DragEvent, targetCategoryId: string) => {
    e.preventDefault();

    if (!isEditing || !draggedCategory) return;

    setCategories((prevCategories) => {
      const draggedIndex = prevCategories.findIndex(
        (c) => c._id === draggedCategory._id
      );

      const targetIndex = prevCategories.findIndex(
        (c) => c._id === targetCategoryId
      );

      if (draggedIndex === -1 || targetIndex === -1) return prevCategories;

      const newCategories = [...prevCategories];

      const draggedItem = newCategories[draggedIndex];
      const targetItem = newCategories[targetIndex];

      const targetSizes = {
        mobileColSpan: targetItem.mobileColSpan,
        tabletColSpan: targetItem.tabletColSpan,
        colSpan: targetItem.colSpan,
      };

      const draggedSizes = {
        mobileColSpan: draggedItem.mobileColSpan,
        tabletColSpan: draggedItem.tabletColSpan,
        colSpan: draggedItem.colSpan,
      };

      newCategories[targetIndex] = {
        ...draggedItem,
        ...targetSizes,
      };

      newCategories[draggedIndex] = {
        ...targetItem,
        ...draggedSizes,
      };

      return newCategories;
    });

    setDraggedCategory(null);
    setHoveredCategoryId(null);
  };

  const resetLayout = () => {
    fetchCategories();
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <ErrorComponent error={error.error} userMessage={error.userMessage} />
    );
  }

  if (!categories.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        Категорий каталога не найдено
      </div>
    );
  }

  return (
    <section className="px-[max(12px,calc((100%-1208px)/2))] mx-auto">
      {isAdmin && (
        <CatalogAdminControls
          isEditing={isEditing}
          onToggleEditingAction={handleToggleEditing}
          onResetLayoutAction={resetLayout}
        />
      )}
      <h1 className="mb-4 md:mb-8 xl:mb-10 flex flex-row text-4xl md:text-5xl xl:text-[64px] text-main-text font-bold">
        Каталог
      </h1>
      <CatalogGrid
        categories={categories}
        isEditing={isEditing}
        draggedCategory={draggedCategory}
        hoveredCategoryId={hoveredCategoryId}
        onDragStartAction={handleDragStart}
        onDragOverAction={handleDragOver}
        onDragLeaveAction={handleDragLeave}
        onDropAction={handleDrop}
      />
    </section>
  );
};

export default CatalogPage;
