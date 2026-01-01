import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DragHandle } from "./DragHandle";
import { MobileCategoryHeader } from "./MobileCategoryHeader";
import { MobileExpandableContent } from "./MobileExpandableContent";
import { SortableItemProps } from "../../types";

export const MobileCategoryCard = ({
  category,
  displayNumericId,
  onDelete,
  onEdit,
}: SortableItemProps) => {
  const [isExpanded, setIsExpended] = useState(false);
  return (
    <div
      className={`p-4 hover:bg-gray-50 relative cursor-pointer`}
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

        <button className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer duration-300 shrink-0 mt-1">
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
