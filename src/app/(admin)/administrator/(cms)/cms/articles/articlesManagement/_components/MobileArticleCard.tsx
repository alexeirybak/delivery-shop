import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DragHandle } from "../../../_components/DragHandle";
import { SortableItemProps } from "../types";
import { MobileArticleHeader } from "./MobileArticleHeader";
import { MobileExpandableContent } from "./MobileExpandableContent";

export const MobileArticleCard = ({
  article,
  displayNumericId,
  isDragging = false,
}: SortableItemProps) => {
  const [isExpanded, setIsExpended] = useState(false);
  return (
    <div
      className={`p-4 hover:bg-gray-50 text-sm transition-custom ${
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
            <MobileArticleHeader
              article={article}
              displayNumericId={displayNumericId}
            />
          </div>
        </div>

        <button className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer transition-custom shrink-0 mt-1">
          <ChevronDown
            className={`w-5 h-5 transition-transform transition-custom ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>
      {isExpanded && <MobileExpandableContent article={article} />}
    </div>
  );
};
