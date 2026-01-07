import { TableHeader } from "./TableHeader";
import { EmptyState } from "./EmptyState";
import { SortableItem } from "./SortableItem";
import { useCategoryStore } from "@/store/categoryStore";
import { Category, CategoryTableProps } from "../../types";
import { SearchBar } from "./SearchBar";
import { AdvancedFilters } from "./AdvancedFilters";
import { useState } from "react";
import { FilterControls } from "./FilterControls";
import { ResultsStats } from "./ResultsStats";

export const CategoryTable = ({ onDelete, onEdit }: CategoryTableProps) => {
  const { categories, loading } = useCategoryStore();
  const [showFilters, setShowFilters] = useState(false);

  const getDisplayNumericId = (category: Category): number | null => {
    return category.numericId;
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Загрузка категорий...</div>
    );
  }
  return (
    <div className="bg-white rounded shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <SearchBar />
          <FilterControls onToggleFilters={setShowFilters} />
        </div>

        <ResultsStats />

        {showFilters && <AdvancedFilters />}
      </div>

      <TableHeader />
      <div className="divide-y divide-gray-200">
        {categories.length === 0 ? (
          <EmptyState />
        ) : (
          categories.map((category) => {
            const categoryId = category._id.toString();

            return (
              <SortableItem
                key={categoryId}
                category={category}
                displayNumericId={getDisplayNumericId(category)}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
