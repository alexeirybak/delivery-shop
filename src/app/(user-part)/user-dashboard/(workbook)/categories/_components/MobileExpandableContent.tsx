import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { MobileExpandableContentProps } from "../types";
import "../styles/mobile-expandable-content.css";

export const MobileExpandableContent = ({
  category,
  onDelete,
  onEdit,
}: MobileExpandableContentProps) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.scrollTo({ top: 0, behavior: "smooth" });
    onEdit(category);
  };
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(category._id.toString());
  };

  return (
    <div className="mobile-expandable-content">
      {category.description && (
        <div className="mobile-expandable-description">
          <div className="mobile-expandable-description-label">Описание</div>
          <div
            className="mobile-expandable-description-text"
            title={category.description}
          >
            {category.description}
          </div>
        </div>
      )}

      <div className="mobile-expandable-actions">
        <button
          onClick={handleEdit}
          className="mobile-expandable-edit-btn"
          title="Редактировать тетрадь"
        >
          <Edit className="mobile-expandable-edit-icon" />
        </button>
        <button
          onClick={handleDelete}
          className="mobile-expandable-delete-btn"
          title="Удалить тетрадь"
        >
          <Trash2 className="mobile-expandable-delete-icon" />
        </button>
      </div>
    </div>
  );
};