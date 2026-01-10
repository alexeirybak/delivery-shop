import { useEffect, useState } from "react";
import { DesktopCategoryRow } from "./DesktopCategoryRow";
import { MobileCategoryCard } from "./MobileCategoryCard";
import { SortableItemProps } from "../../types";
import { useCategoryStore } from "@/store/categoryStore";

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
      setIsMobileView(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isBeingDragged = draggedId === id;

  if (isMobileView) {
    return (
      <div>
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
    <DesktopCategoryRow
      category={category}
      displayNumericId={displayNumericId}
      onDelete={onDelete}
      onEdit={onEdit}
      isDragging={isBeingDragged}
    />
  );
};
