import { TableHeader } from "./TableHeader";
import { SortableItem } from "./SortableItem";
import { useCategoryStore } from "@/store/categoryStore";
import { SearchBar } from "./SearchBar";
import { AdvancedFilters } from "./AdvancedFilters";
import { useState } from "react";
import { FilterControls } from "./FilterControls";
import { ResultsStats } from "./ResultsStats";
import { CategoryTableProps } from "../types";
import { Category } from "../../records/types/categories/categories.types";
import "../styles/category-table.css";
import { WorkbookEmptyState } from "./WorkbookEmptyState";

export const CategoryTable = ({
  onDelete,
  onEdit,
  onReorder,
}: CategoryTableProps) => {
  const {
    categories,
    loading,
    draggedId,
    setDraggedId,
    dragOverId,
    setDragOverId,
    setCategories,
  } = useCategoryStore();
  const [showFilters, setShowFilters] = useState(false);

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== id) {
      setDragOverId(id);
    }
  };

  const handleDrop = async (e: React.DragEvent, droppedId: string) => {
    e.preventDefault();

    if (!draggedId || draggedId === droppedId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const draggedCategory = categories.find(
      (cat) => cat._id.toString() === draggedId,
    );
    const droppedCategory = categories.find(
      (cat) => cat._id.toString() === droppedId,
    );

    if (!draggedCategory || !droppedCategory) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const tempNumericId = draggedCategory.numericId;
    const updatedDraggedCategory = {
      ...draggedCategory,
      numericId: droppedCategory.numericId,
    };
    const updatedDroppedCategory = {
      ...droppedCategory,
      numericId: tempNumericId,
    };

    const updatedCategories = categories
      .map((cat) => {
        if (cat._id.toString() === draggedId) {
          return updatedDraggedCategory;
        }
        if (cat._id.toString() === droppedId) {
          return updatedDroppedCategory;
        }
        return cat;
      })
      .sort((a, b) => a.numericId - b.numericId);

    setCategories(updatedCategories);

    if (onReorder) {
      onReorder([updatedDraggedCategory, updatedDroppedCategory]);
    }

    setDraggedId(null);
    setDragOverId(null);
  };

  const getDisplayNumericId = (category: Category): number | null => {
    return category.numericId;
  };

  if (loading) {
    return <div className="category-table-loading">Загрузка тетрадей...</div>;
  }

  return (
    <div className="category-table">
      <div className="category-table-header">
        <div className="category-table-header-top">
          <SearchBar />
          <FilterControls onToggleFilters={setShowFilters} />
        </div>

        <ResultsStats />

        {showFilters && <AdvancedFilters />}
      </div>

      <TableHeader />
      <div className="category-table-divider">
        {categories.length === 0 ? (
          <WorkbookEmptyState />
        ) : (
          categories.map((category) => {
            const categoryId = category._id.toString();
            const isDragOver = dragOverId === categoryId;

            return (
              <div
                key={categoryId}
                draggable="true"
                onDragStart={() => handleDragStart(categoryId)}
                onDragOver={(e) => handleDragOver(e, categoryId)}
                onDrop={(e) => handleDrop(e, categoryId)}
                className={`category-table-row ${isDragOver ? "category-table-row-drag-over" : ""}`}
              >
                <SortableItem
                  id={categoryId}
                  category={category}
                  displayNumericId={getDisplayNumericId(category)}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
