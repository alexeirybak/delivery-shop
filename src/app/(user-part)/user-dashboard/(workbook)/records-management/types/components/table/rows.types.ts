import { Record } from "../../models";

export interface MobileRecordHeaderProps {
  record: Record;
  displayNumericId: number | null;
}

export interface SortableItemProps {
  record: Record;
  displayNumericId: number | null;
  isDragging?: boolean;
  id?: string;
  onDelete?: (id: string) => void;
}

export interface MobileExpandableContentProps {
  record: Record;
  onDelete?: (id: string) => void;
}
