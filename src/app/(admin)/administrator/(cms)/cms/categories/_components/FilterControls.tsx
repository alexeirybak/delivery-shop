import { Filter, X } from "lucide-react";
import { FilterControlsProps } from "../../types/categories";

export const FilterControls = ({
  showFilters,
  onToggleFilters,
  onResetFilters,
  hasActiveFilters,
}: FilterControlsProps) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggleFilters}
        className={`flex items-center gap-2 px-4 py-2 border rounded cursor-pointer duration-300 ${
          showFilters
            ? "bg-gray-100 border-gray-300"
            : "border-gray-300 hover:bg-gray-50"
        }`}
        title={showFilters ? "Скрыть фильтры" : "Показать фильтры"}
      >
        <Filter className="w-4 h-4" />
        <span className="hidden sm:inline">Фильтры</span>
      </button>

      {hasActiveFilters && (
        <button
          onClick={onResetFilters}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer duration-300"
          title="Сбросить все фильтры"
        >
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">Сбросить</span>
        </button>
      )}
    </div>
  );
};

