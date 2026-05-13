import { useEffect, useState } from "react";
import { SortableItemProps } from "../types";
import { useRecordsManagementStore } from "@/store/recordsManagementStore";
import { DesktopRecordRow } from "./DesktopRecordRow";
import { MobileRecordCard } from "./MobileRecordCard";

export const SortableItem = ({
  id,
  record,
  displayNumericId,
  onDelete,
}: SortableItemProps) => {
  const { draggedId } = useRecordsManagementStore();
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isBeingDragged = draggedId === id;

  if (isMobileView) {
    return (
      <MobileRecordCard
        record={record}
        displayNumericId={displayNumericId}
        isDragging={isBeingDragged}
        onDelete={() => onDelete?.(record._id.toString())}
      />
    );
  }

  return (
    <DesktopRecordRow
      record={record}
      displayNumericId={displayNumericId}
      isDragging={isBeingDragged}
      onDelete={onDelete}
    />
  );
};
