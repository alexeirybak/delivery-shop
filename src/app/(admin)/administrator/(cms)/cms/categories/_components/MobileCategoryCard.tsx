import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DragHandle } from "../../_components/DragHandle";
import { MobileCategoryHeader } from "./MobileCategoryHeader";
import { MobileExpandableContent } from "./MobileExpandableContent";
import { SortableItemProps } from "../types";

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
      className={`p-4 hover:bg-gray-50 text-sm duration-200 ${
        isDragging
          ? "opacity-60 bg-linear-to-r from-blue-50 to-green-50 shadow-lg border-2 border-green-400 transform scale-[0.995]"
          : "hover:shadow-sm"
      }`}
      onClick={() => setIsExpended(!isExpanded)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-1">
            <DragHandle />
            <MobileCategoryHeader
              category={category}
              displayNumericId={displayNumericId}
            />
          </div>
        </div>

        <button className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer transition-custom shrink-0 mt-1">
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          />
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
