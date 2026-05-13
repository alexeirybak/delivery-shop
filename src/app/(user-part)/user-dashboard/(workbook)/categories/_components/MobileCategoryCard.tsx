import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { MobileCategoryHeader } from "./MobileCategoryHeader";
import { MobileExpandableContent } from "./MobileExpandableContent";
import { SortableItemProps } from "../types";
import { DragHandle } from "../../workbook/_components/DragHandle";
import "../styles/mobile-category-card.css";

export const MobileCategoryCard = ({
  category,
  displayNumericId,
  onDelete,
  onEdit,
  isDragging = false,
}: SortableItemProps) => {
  const [isExpanded, setIsExpended] = useState(false);
  return (
    <div
      className={`mobile-category-card ${
        isDragging ? "mobile-category-card-dragging" : ""
      }`}
      onClick={() => setIsExpended(!isExpanded)}
    >
      <div className="mobile-category-card-header">
        <div className="mobile-category-card-content">
          <div className="mobile-category-card-info">
            <DragHandle />
            <MobileCategoryHeader
              category={category}
              displayNumericId={displayNumericId}
            />
          </div>
        </div>

        <button className="mobile-category-card-expand-btn">
          <ChevronDown className={`${isExpanded ? "rotated" : ""}`} />
        </button>
      </div>
      {isExpanded && (
        <MobileExpandableContent
          category={category}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      )}
    </div>
  );
};
