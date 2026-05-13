import { useEffect, useState } from "react";
import { DesktopCategoryRow } from "./DesktopCategoryRow";
import { MobileCategoryCard } from "./MobileCategoryCard";
import { useCategoryStore } from "@/store/categoryStore";
import { SortableItemProps } from "../types";
import "../styles/sortable-item.css";

export const SortableItem = ({
  id,
  category,
  displayNumericId,
  onDelete,
  onEdit,
}: SortableItemProps) => {
  const { draggedId } = useCategoryStore();
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isBeingDragged = draggedId === id;

  if (isMobileView) {
    return (
      <div className="sortable-item">
        <MobileCategoryCard
          category={category}
          displayNumericId={displayNumericId}
          onDelete={onDelete}
          onEdit={onEdit}
          isDragging={isBeingDragged}
        />
      </div>
    );
  }

  return (
    <div className="sortable-item">
      <DesktopCategoryRow
        category={category}
        displayNumericId={displayNumericId}
        onDelete={onDelete}
        onEdit={onEdit}
        isDragging={isBeingDragged}
      />
    </div>
  );
};
