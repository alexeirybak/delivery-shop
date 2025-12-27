import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { MobileCategoryCardProps } from "../../types";
import { DragHandle } from "./DragHandle";
import { MobileCategoryHeader } from "./MobileCategoryHeader";
import { MobileExpandableContent } from "./MobileExpandableContent";

// Удаляем isExpanded и onToggle из пропсов
export const MobileCategoryCard: React.FC<Omit<MobileCategoryCardProps, 'isExpanded' | 'onToggle'>> = ({
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

  const handleCardClick = () => setIsExpanded(!isExpanded);
  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      style={style}
      className={`p-4 hover:bg-gray-50 relative ${
        isDragging ? "bg-gray-100 shadow-lg border border-green-300" : ""
      } ${isActiveDragging ? "ring-2 ring-green-500" : ""}`}
    >
      <div
        className="flex justify-between items-start"
        onClick={handleCardClick}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-1">
            <DragHandle {...dragHandleProps} />

            <MobileCategoryHeader
              category={category}
              displayNumericId={displayNumericId}
            />
          </div>
        </div>

        <button
          className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer duration-300 shrink-0 mt-1"
          onClick={handleToggleClick}
          title={isExpanded ? "Свернуть" : "Развернуть"}
        >
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>
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