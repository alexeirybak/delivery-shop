import React, { useEffect, useState } from "react";
import { SortableItemProps } from "../../types";
import { MobileCategoryCard } from "./MobileCategoryCard";
import { DesktopCategoryRow } from "./DesktopCategoryRow";
import { useCategoryStore } from "@/store/categoryStore";

export const SortableItem = ({
  id,
  category,
  displayNumericId,
  onEdit,
  onDelete,
}: SortableItemProps) => {
  const [isMobileView, setIsMobileView] = useState(false);
  const { draggedId } = useCategoryStore();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isBeingDragged = draggedId === id; // Правильно вычисляем

  if (isMobileView) {
    return (
      <MobileCategoryCard
        category={category}
        displayNumericId={displayNumericId}
        onEdit={onEdit}
        onDelete={onDelete}
        isDragging={isBeingDragged} // Передаем как пропс
      />
    );
  }

  return (
    <DesktopCategoryRow
      category={category}
      displayNumericId={displayNumericId}
      onEdit={onEdit}
      onDelete={onDelete}
      isDragging={isBeingDragged} // Передаем как пропс
    />
  );
};
