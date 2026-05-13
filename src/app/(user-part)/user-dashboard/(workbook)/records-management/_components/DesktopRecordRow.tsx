import { Edit, Star, Trash2 } from "lucide-react";
import { SortableItemProps } from "../types";
import { useRouter } from "next/navigation";
import { useRecordsManagementStore } from "@/store/recordsManagementStore";
import { DragHandle } from "../../workbook/_components/DragHandle";
import "../styles/desktop-record-row.css";

export const DesktopRecordRow = ({
  record,
  displayNumericId,
  isDragging = false,
  onDelete,
}: SortableItemProps) => {
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

  return (
    <div
      className={`desktop-record-row ${
        isDragging ? "desktop-record-row-dragging" : ""
      }`}
    >
      <div className="desktop-record-row-content">
        <div className="desktop-record-row-cell">
          <DragHandle />
        </div>

        <div className="desktop-record-row-cell desktop-record-row-cell-center">
          <span className="desktop-record-row-id" title="Порядковый номер">
            {displayNumericId || "-"}
          </span>
        </div>

        <div className="desktop-record-row-cell">
          <div className="desktop-record-row-name" title={record.name}>
            {record.name}
          </div>
        </div>

        <div className="desktop-record-row-cell">
          <div
            className="desktop-record-row-category"
            title={`Тетрадь: ${record.categoryName}`}
          >
            {record.categoryName}
          </div>
        </div>

        <div className="desktop-record-row-cell desktop-record-row-cell-center">
          <button
            onClick={handleFeaturedToggle}
            className={`desktop-record-row-star ${
              record.isFeatured
                ? "desktop-record-row-star-featured"
                : "desktop-record-row-star-normal"
            }`}
            title={
              record.isFeatured
                ? "Убрать из избранного"
                : "Добавить в избранное"
            }
          >
            <Star
              className={`desktop-record-row-star-icon ${
                record.isFeatured
                  ? "desktop-record-row-star-icon-featured"
                  : "desktop-record-row-star-icon-normal"
              }`}
            />
          </button>
        </div>

        <div className="desktop-record-row-cell">
          <div
            className="desktop-record-row-date"
            title={`Дата создания: ${new Date(record.createdAt).toLocaleDateString("ru-RU")}`}
          >
            {new Date(record.createdAt).toLocaleDateString("ru-RU")}
          </div>
        </div>

        <div className="desktop-record-row-cell">
          <div className="desktop-record-row-actions">
            <button
              onClick={handleEdit}
              className="desktop-record-row-edit"
              title="Редактировать запись"
            >
              <Edit className="w-3 h-3" />
            </button>
            <button
              onClick={() => onDelete?.(record._id.toString())}
              className="desktop-record-row-delete"
              title="Удалить запись"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
