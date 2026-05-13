import { Filter, X } from "lucide-react";
import { useState } from "react";
import { FilterControlsProps } from "../types/components";
import { useRecordsManagementStore } from "@/store/recordsManagementStore";
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
    loadRecords,
  } = useRecordsManagementStore();

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
    loadRecords({ page: 1, search: "" });
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
        className={`filter-button ${localShowFilters ? "filter-button-active" : "filter-button-inactive"}`}
        title={localShowFilters ? "Скрыть фильтры" : "Показать фильтры"}
      >
        <Filter className="filter-icon" />
        <span className="filter-button-text">Фильтры</span>
      </button>

      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="filter-reset"
          title="Сбросить все фильтры"
        >
          <X className="filter-reset-icon" />
          <span className="filter-reset-text">Сбросить</span>
        </button>
      )}
    </div>
  );
};
