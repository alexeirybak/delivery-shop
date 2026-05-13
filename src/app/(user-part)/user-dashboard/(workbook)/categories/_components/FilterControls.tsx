import { Filter, X } from "lucide-react";
import { useCategoryStore } from "@/store/categoryStore";
import { useState } from "react";
import { FilterControlsProps } from "../types/components";
import "../styles/filter-controls.css";

export const FilterControls = ({ onToggleFilters }: FilterControlsProps) => {
  const {
    filterType,
    sortField,
    sortDirection,
    searchQuery,
    setFilterType,
    setSortField,
    setSortDirection,
    handleSearchChange,
    loadCategories,
  } = useCategoryStore();

  const [localShowFilters, setLocalShowFilters] = useState(false);

  const hasActiveFilters = Boolean(
    filterType !== "all" ||
    sortField !== "numericId" ||
    sortDirection !== "asc" ||
    searchQuery !== "",
  );

  const resetFilters = () => {
    handleSearchChange("");
    setFilterType("all");
    setSortField("numericId");
    setSortDirection("asc");
    loadCategories({ page: 1, search: "" });
  };

  const handleToggleFilters = () => {
    const newValue = !localShowFilters;
    setLocalShowFilters(newValue);
    if (onToggleFilters) {
      onToggleFilters(newValue);
    }
  };

  return (
    <div className="filter-controls">
      <button
        onClick={handleToggleFilters}
        className={`filter-controls-btn ${
          localShowFilters
            ? "filter-controls-btn-active"
            : "filter-controls-btn-inactive"
        }`}
        title={localShowFilters ? "Скрыть фильтры" : "Показать фильтры"}
      >
        <Filter />
        <span>Фильтры</span>
      </button>

      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="filter-controls-reset"
          title="Сбросить все фильтры"
        >
          <X />
          <span>Сбросить</span>
        </button>
      )}
    </div>
  );
};
