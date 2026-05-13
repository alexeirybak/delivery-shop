import { useCategoryStore } from "@/store/categoryStore";
import "../styles/reorder-status.css";

export const ReorderStatus = () => {
  const { isReordering } = useCategoryStore();
  if (!isReordering) return null;

  return (
    <div className="reorder-status">
      <div className="reorder-status-indicator"></div>
      Обновление порядка тетрадей...
    </div>
  );
};
