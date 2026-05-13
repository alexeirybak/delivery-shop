import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { SortableItemProps } from "../types";
import { DragHandle } from "../../workbook/_components/DragHandle";
import "../styles/desktop-category-row.css";

export const DesktopCategoryRow = ({
  category,
  displayNumericId,
  onDelete,
  onEdit,
  isDragging = false,
}: SortableItemProps) => {
  const [imageError, setImageError] = useState(false);
  const showImage = category.image && !imageError;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.scrollTo({ top: 0, behavior: "smooth" });
    onEdit(category);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(category._id.toString());
  };

  const imagePath = category.image || "";

  return (
    <div
      className={`desktop-category-row ${isDragging ? "desktop-category-row-dragging" : ""}`}
    >
      <div className="desktop-category-grid">
        <div>
          <DragHandle />
        </div>

        <div className="desktop-category-image">
          <span
            className="desktop-category-numeric-id"
            title="Порядковый номер"
          >
            {displayNumericId || "-"}
          </span>
        </div>

        <div className="desktop-category-image">
          {showImage ? (
            <Image
              src={imagePath}
              alt={category.name}
              width={50}
              height={50}
              className="desktop-category-image-img"
              title={category.name}
              onError={() => setImageError(true)}
              loading="lazy"
              unoptimized={true}
            />
          ) : (
            <div className="desktop-category-image-placeholder">
              <span>Нет</span>
            </div>
          )}
        </div>

        <div className="desktop-category-name">
          <div title={category.name}>{category.name}</div>
        </div>

        <div className="desktop-category-description">
          <div title={category.description || "Нет описания"}>
            {category.description || (
              <span className="desktop-category-description-empty">—</span>
            )}
          </div>
        </div>

        <div className="desktop-category-records">
          <div title={category.recordsCount || "Нет"}>
            {category.recordsCount || (
              <span className="desktop-category-description-empty">—</span>
            )}
          </div>
        </div>

        <div className="desktop-category-date">
          <div
            title={`Дата создания: ${new Date(category.createdAt).toLocaleDateString("ru-RU")}`}
          >
            {new Date(category.createdAt).toLocaleDateString("ru-RU")}
          </div>
        </div>

        <div className="desktop-category-actions">
          <button
            onClick={handleEdit}
            className="desktop-category-edit-btn"
            title="Редактировать тетрадь"
          >
            <Edit />
          </button>
          <button
            onClick={handleDelete}
            className="desktop-category-delete-btn"
            title="Удалить тетрадь"
          >
            <Trash2 />
          </button>
        </div>
      </div>
    </div>
  );
};
