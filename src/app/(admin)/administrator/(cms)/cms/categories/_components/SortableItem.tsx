import { useEffect, useState } from "react";
import { DesktopCategoryRow } from "./DesktopCategoryRow";
import { MobileCategoryCard } from "./MobileCategoryCard";

const SortableItem = ({ id, category, displayNumericId, onDelete, onEdit }) => {
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

export default SortableItem;
