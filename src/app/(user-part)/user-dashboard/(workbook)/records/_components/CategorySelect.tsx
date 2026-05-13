import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useCategoryStore } from "@/store/categoryStore";
import { CategorySelectProps } from "../types";
import "../styles/category-select.css";

export const CategorySelect = ({ value, onChange }: CategorySelectProps) => {
  const { categories } = useCategoryStore();
  const [isOpen, setIsOpen] = useState(false);

  const selectedCategory = categories.find((cat) => cat._id === value);

  const handleSelect = (category: (typeof categories)[0]) => {
    onChange(category._id, category.name);
    setIsOpen(false);
  };

  return (
    <div className="category-select">
      <div className="category-select-wrapper">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="category-select-button"
        >
          <span
            className={
              selectedCategory
                ? "category-select-button-text"
                : "category-select-button-text-placeholder"
            }
          >
            {selectedCategory ? selectedCategory.name : "Выберите тетрадь"}
          </span>
          <ChevronDown
            className={`category-select-icon ${isOpen ? "category-select-icon-rotated" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="category-select-dropdown">
            {categories.map((category) => (
              <button
                key={category._id}
                type="button"
                onClick={() => handleSelect(category)}
                className="category-select-option"
              >
                <span>{category.name}</span>
                {value === category._id && (
                  <Check className="category-select-option-check" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {isOpen && (
        <div
          className="category-select-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
