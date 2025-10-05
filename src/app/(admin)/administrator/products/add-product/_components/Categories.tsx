"use client";

import { formStyles } from "@/app/styles";
import MiniLoader from "@/components/MiniLoader";
import { useState, useEffect } from "react";

interface Category {
  _id: string;
  title: string;
  slug: string;
}

interface CategoriesProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

const Categories = ({
  selectedCategories,
  onCategoriesChange,
}: CategoriesProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/catalog");
        if (!response.ok) {
          throw new Error("Ошибка загрузки категорий");
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedSlugs = selectedOptions.map((option) => option.value);
    onCategoriesChange(selectedSlugs);
  };

  if (loading) {
    return <MiniLoader />;
  }

  if (error) {
    return (
      <div>
        <label className="block text-sm font-medium mb-2">
          Категории <span className="text-[#d80000]">*</span>
        </label>
        <div className="text-sm text-red-500">Ошибка: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Категории <span className="text-[#d80000]">*</span>
      </label>
      <select
        multiple
        value={selectedCategories}
        onChange={handleCategoryChange}
        className={`${formStyles.input} bg-white [&&]:w-full [&&]:h-32`}
        required
      >
        {categories.map((category) => (
          <option key={category._id} value={category.slug}>
            {category.title}
          </option>
        ))}
      </select>
      <div className="mt-2 text-sm text-gray-600">
        Для выбора нескольких категорий удерживайте Ctrl (Cmd на Mac)
      </div>
      {selectedCategories.length > 0 && (
        <div className="mt-3">
          <span className="text-sm font-medium">Выбранные категории: </span>
          <span className="text-sm text-gray-600">
            {selectedCategories.length} шт.
          </span>
        </div>
      )}
    </div>
  );
};

export default Categories;
