import { useEffect, useState } from "react";
import { TableHeader } from "./TableHeader";
import { EmptyState } from "./EmptyState";
import SortableItem from "./SortableItem";

const CategoryTable = ({ categories, loading, onDelete, onEdit }) => {
  const [items, setItems] = useState<Category[]>(categories);

  useEffect(() => {
    setItems(categories);
  }, [categories]);
  const getDisplayNumericId = (category: Category): number | null => {
    return category.numericId;
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Загрузка категорий...</div>
    );
  }
  return (
    <>
      <TableHeader />
      <div className="divide-y divide-gray-200">
        {items.length === 0 ? (
          <EmptyState />
        ) : (
          items.map((category) => {
            const categoryId = category._id.toString();

            return (
              <SortableItem
                key={categoryId}
                id={categoryId}
                category={category}
                displayNumericId={getDisplayNumericId(category)}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            );
          })
        )}
      </div>
    </>
  );
};

export default CategoryTable;
