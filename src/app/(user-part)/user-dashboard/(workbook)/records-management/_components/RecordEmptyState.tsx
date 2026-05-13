import { useRecordsManagementStore } from "@/store/recordsManagementStore";
import { FolderOpen, Search } from "lucide-react";
import "../styles/empty-state.css";

export const RecordsEmptyState = () => {
  const { searchQuery } = useRecordsManagementStore();
  
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {searchQuery ? <Search /> : <FolderOpen />}
      </div>
      <div className="empty-state-title">
        {searchQuery ? "Ничего не найдено" : "Записей пока нет"}
      </div>
      <div className="empty-state-description">
        {searchQuery
          ? "Попробуйте изменить параметры поиска"
          : "Начните создавать записи, чтобы они появились здесь"}
      </div>
    </div>
  );
};