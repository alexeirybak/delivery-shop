import { useCategoryStore } from "@/store/categoryStore";
import "../styles/empty-state.css";

export const WorkbookEmptyState = () => {
  const { searchQuery } = useCategoryStore();
  return (
    <div className="empty-state">
      {searchQuery
        ? "Ничего не найдено по Вашему запросу"
        : "Тетрадей пока нет"}
    </div>
  );
};
