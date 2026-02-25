"use client";

import { ChevronDown, Check } from "lucide-react";
import { CategorySelectProps } from "../types/auto-generate.types";
import { useCategoryStore } from "@/store/categoryStore";

const CategorySelect = ({
  selectedCategoryId,
  isOpen,
  onCategorySelect,
  onToggleOpen,
}: CategorySelectProps) => {
  const { categories } = useCategoryStore();
  const selectedCategory = categories.find(
    (cat) => cat._id === selectedCategoryId,
  );

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Категория статьи *
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={onToggleOpen}
          className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded focus:outline-none focus:ring-3 focus:ring-primary/20 focus:border-primary transition-custom text-left flex justify-between items-center"
        >
          <span
            className={selectedCategory ? "text-gray-900" : "text-gray-500"}
          >
            {selectedCategory ? selectedCategory.name : "Выберите категорию"}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform transition-custom ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <>
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
              {categories.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  Загрузка категорий...
                </div>
              ) : (
                categories.map((category) => (
                  <button
                    key={category._id}
                    type="button"
                    onClick={() => onCategorySelect(category._id)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center justify-between"
                  >
                    <span>{category.name}</span>
                    {selectedCategoryId === category._id && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </button>
                ))
              )}
            </div>
            <div className="fixed inset-0 z-0" onClick={onToggleOpen} />
          </>
        )}
      </div>
    </div>
  );
};

export default CategorySelect;
