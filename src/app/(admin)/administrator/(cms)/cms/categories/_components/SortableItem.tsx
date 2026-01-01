import { useEffect, useState } from "react";
import { DesktopCategoryRow } from "./DesktopCategoryRow";
import { MobileCategoryCard } from "./MobileCategoryCard";
import { SortableItemProps } from "../../types";

export const SortableItem = ({
  category,
  displayNumericId,
  onDelete,
  onEdit,
}: SortableItemProps) => {
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobileView) {
    return (
      <div>
        <MobileCategoryCard
          category={category}
          displayNumericId={displayNumericId}
          onDelete={onDelete}
          onEdit={onEdit}
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
    />
  );
};
