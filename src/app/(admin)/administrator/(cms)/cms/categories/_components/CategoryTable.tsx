import { TableHeader } from "./TableHeader";
import { EmptyState } from "./EmptyState";
import { SortableItem } from "./SortableItem";
import { useCategoryStore } from "@/store/categoryStore";
import { SearchBar } from "./SearchBar";
import { AdvancedFilters } from "./AdvancedFilters";
import { useState } from "react";
import { FilterControls } from "./FilterControls";
import { ResultsStats } from "./ResultsStats";
import { Category, CategoryTableProps } from "../types";

export const CategoryTable = ({
  onDelete,
  onEdit,
  onReorder,
}: CategoryTableProps) => {
  const { categories, loading } = useCategoryStore();
  const [showFilters, setShowFilters] = useState(false);

  const { draggedId, setDraggedId, dragOverId, setDragOverId, setCategories } =
    useCategoryStore();

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

    // Находим категории
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

    // Меняем местами numericId
    const tempNumericId = draggedCategory.numericId;
    const updatedDraggedCategory = {
      ...draggedCategory,
      numericId: droppedCategory.numericId,
    };
    const updatedDroppedCategory = {
      ...droppedCategory,
      numericId: tempNumericId,
    };

    // Обновляем локальное состояние
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
      .sort((a, b) => a.numericId - b.numericId); // Сортируем по новым numericId

    setCategories(updatedCategories);

    // Отправляем на сервер обновление двух категорий
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