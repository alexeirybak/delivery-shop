import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SortableItemProps } from "../types";
import { DragHandle } from "../../workbook/_components/DragHandle";
import { MobileRecordHeader } from "./MobileRecordHeader";
import "./../styles/mobile-record-card.css";
import { MobileExpandableContent } from "./MobileExpandableContent";

export const MobileRecordCard = ({
  record,
  displayNumericId,
  isDragging = false,
}: SortableItemProps) => {
  const [isExpanded, setIsExpended] = useState(false);
  
  return (
    <div
      className={`mobile-record-card ${
        isDragging ? "mobile-record-card-dragging" : ""
      }`}
      onClick={() => setIsExpended(!isExpanded)}
    >
      <div className="mobile-record-card-header">
        <div className="mobile-record-card-content">
          <div className="mobile-record-card-info">
            <DragHandle />
            <MobileRecordHeader
              record={record}
              displayNumericId={displayNumericId}
            />
          </div>
        </div>

        <button className="mobile-record-card-expand-btn">
          <ChevronDown
            className={`mobile-record-card-expand-icon ${
              isExpanded ? "mobile-record-card-expand-icon-rotated" : ""
            }`}
          />
        </button>
      </div>
      {isExpanded && <MobileExpandableContent record={record} />}
    </div>
  );
};