import { MobileExpandableContentProps } from "../types";
import { useRecordsManagementStore } from "@/store/recordsManagementStore";
import { Star, Calendar, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import "./../styles/mobile-expandable-content.css";

export const MobileExpandableContent = ({
  record,
  onDelete,
}: MobileExpandableContentProps) => {
  const { updateRecordFeatured } = useRecordsManagementStore();
  const router = useRouter();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/user-dashboard/records?id=${record._id}`);
  };

  const handleFeaturedToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateRecordFeatured(record._id.toString(), !record.isFeatured);
    } catch (error) {
      console.error("Ошибка изменения избранности:", error);
    }
  };

  const formattedDate = new Date(record.createdAt).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="mobile-expandable-content">
      <div className="mobile-expandable-actions">
        <button
          onClick={handleFeaturedToggle}
          className={`mobile-expandable-star-btn ${
            record.isFeatured
              ? "mobile-expandable-star-btn-featured"
              : "mobile-expandable-star-btn-normal"
          }`}
          title={
            record.isFeatured ? "Убрать из избранного" : "Добавить в избранное"
          }
        >
          <Star
            className={`mobile-expandable-star-icon ${
              record.isFeatured
                ? "mobile-expandable-star-icon-featured"
                : "mobile-expandable-star-icon-normal"
            }`}
          />
        </button>
      </div>

      <div className="mobile-expandable-info-grid">
        <div className="mobile-expandable-info-card">
          <div className="mobile-expandable-info-header">
            <Calendar className="mobile-expandable-info-icon" />
            <span className="mobile-expandable-info-label">Создана</span>
          </div>
          <div className="mobile-expandable-info-value">{formattedDate}</div>
        </div>
      </div>

      <div className="mobile-expandable-edit-wrapper">
        <button
          onClick={handleEdit}
          className="mobile-expandable-edit-btn"
          title="Редактировать статью"
        >
          <Edit className="mobile-expandable-edit-icon" />
        </button>
        <button
          onClick={() => onDelete?.(record._id.toString())}
          className="mobile-expandable-delete-btn"
          title="Удалить запись"
        >
          <Trash2 />
        </button>
      </div>
    </div>
  );
};
