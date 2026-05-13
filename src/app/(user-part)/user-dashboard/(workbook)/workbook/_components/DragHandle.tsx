import { GripVertical } from "lucide-react";
import "../../styles/drag-handle.css";

export const DragHandle = () => {
  return (
    <div
      className="drag-handle"
      title="Перетащить для сортировки"
    >
      <GripVertical />
    </div>
  );
};