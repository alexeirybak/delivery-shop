import { GripVertical } from "lucide-react";

export const DragHandle = () => {
  return (
    <div
      className="text-gray-400 flex items-center justify-center cursor-grab active:cursor-grabbing hover:opacity-100 transition-opacity p-2"
      title="Перетащить для сортировки"
    >
      <GripVertical className="w-5 h-5" />
    </div>
  );
};