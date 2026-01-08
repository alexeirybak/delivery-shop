import { ChevronDown } from "lucide-react";
import { MobileCategoryCardProps } from "../../types";
import { DragHandle } from "./DragHandle";
import { MobileCategoryHeader } from "./MobileCategoryHeader";
import { MobileExpandableContent } from "./MobileExpandableContent";
import { useState } from "react";

export const MobileCategoryCard: React.FC<MobileCategoryCardProps> = ({
  category,
  displayNumericId,
  onEdit,
  onDelete,
  isDragging = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div
      className={`p-4 hover:bg-gray-50 text-sm duration-200 ${
        isDragging
          ? "opacity-60 bg-linear-to-r from-blue-50 to-green-50 shadow-lg border-2 border-green-400 transform scale-[0.995]"
          : "hover:shadow-sm"
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0 flex items-start gap-3">
          <DragHandle />
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
