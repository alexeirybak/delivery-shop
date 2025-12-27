import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { MobileCategoryCardProps } from "../../types";
import { DragHandle } from "./DragHandle";
import { MobileCategoryHeader } from "./MobileCategoryHeader";
import { MobileExpandableContent } from "./MobileExpandableContent";

export const MobileCategoryCard: React.FC<
  Omit<MobileCategoryCardProps, "isExpanded" | "onToggle">
> = ({
  category,
  displayNumericId,
  onEdit,
  onDelete,
  dragHandleProps,
  style,
  isDragging,
  isActiveDragging,
}) => {
  // Добавляем локальное состояние
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      style={style}
      className={`p-4 hover:bg-gray-50 relative cursor-pointer ${
        isDragging ? "bg-gray-100 shadow-lg border border-green-300" : ""
      } ${isActiveDragging ? "ring-2 ring-green-500" : ""}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0 flex items-start gap-3">
          <DragHandle {...dragHandleProps} />

          <MobileCategoryHeader
            category={category}
            displayNumericId={displayNumericId}
          />
        </div>

        <ChevronDown
          className={`w-5 h-5 text-gray-400 ml-2 shrink-0 mt-1 transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </div>

      {isExpanded && (
        <MobileExpandableContent
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};
