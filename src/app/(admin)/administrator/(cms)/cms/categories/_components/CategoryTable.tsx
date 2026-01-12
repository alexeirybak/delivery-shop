import { TableHeader } from "./TableHeader";
import { EmptyState } from "./EmptyState";
import { SortableItem } from "./SortableItem";
import { useCategoryStore } from "@/store/categoryStore";
import { Category, CategoryTableProps } from "../types";
import { SearchBar } from "./SearchBar";
import { AdvancedFilters } from "./AdvancedFilters";
import { useState } from "react";
import { FilterControls } from "./FilterControls";
import { ResultsStats } from "./ResultsStats";

export const CategoryTable = ({
  onDelete,
  onEdit,
  onReorder,
}: CategoryTableProps) => {
  const { categories, loading } = useCategoryStore();
  const [showFilters, setShowFilters] = useState(false);

  const {
    draggedId,
    setDraggedId,
    dragOverId,
    setDragOverId,
    setTempOrder,
    setCategories,
  } = useCategoryStore();

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== id) {
      setDragOverId(id);
    }
  };

  const handleDrop = (e: React.DragEvent, droppedId: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== droppedId) {
      const oldIndex = categories.findIndex(
        (item) => item._id.toString() === draggedId
      );

      const newIndex = categories.findIndex(
        (item) => item._id.toString() === droppedId
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = [...categories];
        const [movedItem] = newItems.splice(oldIndex, 1);

        newItems.splice(newIndex, 0, movedItem);

        const newTempOrder = new Map();

        newItems.forEach((item, index) => {
          newTempOrder.set(item._id.toString(), index + 1);
        });

        setTempOrder(newTempOrder);

        setCategories(newItems);

        if (onReorder) {
          const reorderedForSave = newItems.map((item, index) => ({
            ...item,
            numericId: index + 1,
          }));
          onReorder(reorderedForSave);
        }
      }
    }

    setDraggedId(null);
    setDragOverId(null);
    setTempOrder(new Map());
  };

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
            const isDragOver = dragOverId === categoryId;

            return (
              <div
                key={categoryId}
                draggable="true"
                onDragStart={() => handleDragStart(categoryId)}
                onDragOver={(e) => handleDragOver(e, categoryId)}
                onDrop={(e) => handleDrop(e, categoryId)}
                className={`${isDragOver ? "bg-blue-50" : ""}`}
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
