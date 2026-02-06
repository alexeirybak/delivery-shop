import { useEffect, useState } from "react";
import { SortableItemProps } from "../types";
import { useArticlesManagementStore } from "@/store/articlesManagementStore";
import { MobileArticleCard } from "./MobileArticleCard";
import { DesktopArticleRow } from "./DesktopArticleRow";

export const SortableItem = ({
  id,
  article,
  displayNumericId,
}: SortableItemProps) => {
  const { draggedId } = useArticlesManagementStore();
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
        <MobileArticleCard
          article={article}
          displayNumericId={displayNumericId}
          isDragging={isBeingDragged}
        />
      </div>
    );
  }

  return (
    <DesktopArticleRow
      article={article}
      displayNumericId={displayNumericId}
      isDragging={isBeingDragged}
    />
  );
};
