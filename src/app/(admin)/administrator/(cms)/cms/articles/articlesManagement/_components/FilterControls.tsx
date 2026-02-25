import { Filter, X } from "lucide-react";
import { useState } from "react";
import { FilterControlsProps } from "../types/components";
import { useArticlesManagementStore } from "@/store/articlesManagementStore";

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
    loadArticles,
  } = useArticlesManagementStore();

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
    loadArticles({ page: 1, search: "" });
  };

  const handleToggleFilters = () => {
    const newValue = !localShowFilters;
    setLocalShowFilters(newValue);
    if (onToggleFilters) {
      onToggleFilters(newValue);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggleFilters}
        className={`flex items-center gap-2 px-4 py-2 border rounded cursor-pointer transition-custom ${
          localShowFilters
            ? "bg-gray-100 border-gray-300"
            : "border-gray-300 hover:bg-gray-50"
        }`}
        title={localShowFilters ? "Скрыть фильтры" : "Показать фильтры"}
      >
        <Filter className="w-4 h-4" />
        <span className="hidden sm:inline">Фильтры</span>
      </button>

      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer transition-custom"
          title="Сбросить все фильтры"
        >
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">Сбросить</span>
        </button>
      )}
    </div>
  );
};
