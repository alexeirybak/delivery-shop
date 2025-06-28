"use client";

import { CatalogProps } from "@/types/catalog";
import { useEffect, useState } from "react";
import GridCategoryBlock from "../GridCategoryBlock";

const CatalogPage = () => {
  const [categories, setCategories] = useState<CatalogProps[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isAdmin = true;

  const fetchCategories = async () => {
    try {
      const response = await fetch("api/catalog");
      if (!response.ok)
        throw new Error(`Ошибка ответа сервера: ${response.status}`);

      const data: CatalogProps[] = await response.json();
      console.log(data);
      setCategories(data.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error("Не удалось получить категории:", error);
      setError("Не удалось получить категории");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleToggleEditing = async () => {
    setIsEditing(!isEditing);
  };

  const resetLayout = () => {
    fetchCategories();
  };

  if (isLoading) {
    return <div className="text-center py-8">Загрузка каталога...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!categories.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        Категорий каталога не найдено
      </div>
    );
  }

  return (
    <section className="px-[max(12px,calc((100%-1208px)/2))] mx-auto mb-20">
      {isAdmin && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleToggleEditing}
            className="border border-(--color-primary) hover:text-white hover:bg-[#ff6633] hover:border-transparent active:shadow-(--shadow-button-active) w-1/2 h-10 rounded p-2 justify-center items-center text-(--color-primary) transition-all duration-300 cursor-pointer select-none"
          >
            {isEditing ? "Закончить редактирование" : "Изменить расположение"}
          </button>
          {isEditing && (
            <button
              onClick={resetLayout}
              className="ml-3 p-2 text-xs justify-center items-center active:shadow-(--shadow-button-active) border-none rounded cursor-pointer transition-colors duration-300 bg-[#f3f2f1] hover:shadow-(--shadow-button-secondary)"
            >
              Сбросить
            </button>
          )}
        </div>
      )}
      <h1 className="mb-4 md:mb-8 xl:mb-10 flex flex-row text-4xl mb:text-5xl xl:text-[64px] text-[#414141] font-bold">
        Каталог
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-8">
        {categories.map((category) => (
          <div
            key={category._id}
            className={`${category.mobileColSpan} ${category.tabletColSpan} ${category.colSpan} bg-gray-100 rounded overflow-hidden min-h-50 h-full`}
          >
            <div className="h-full w-full">
              <GridCategoryBlock
                id={category.id}
                title={category.title}
                img={category.img}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CatalogPage;
