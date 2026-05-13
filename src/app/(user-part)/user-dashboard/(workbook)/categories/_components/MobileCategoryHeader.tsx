import { MobileCategoryHeaderProps } from "../types";
import "../styles/mobile-category-header.css";

export const MobileCategoryHeader = ({
  category,
  displayNumericId,
}: MobileCategoryHeaderProps) => (
  <div className="mobile-category-header">
    <div className="mobile-category-header-top">
      <span className="mobile-category-header-numeric" title="Порядковый номер">
        {displayNumericId || "—"}
      </span>
      <h3 className="mobile-category-header-name" title={category.name}>
        {category.name}
      </h3>
    </div>

    <div className="mobile-category-header-details">
      <span
        className="mobile-category-header-date"
        title={`Дата создания: ${new Date(category.createdAt).toLocaleDateString("ru-RU")}`}
      >
        {new Date(category.createdAt).toLocaleDateString("ru-RU")}
      </span>
    </div>
  </div>
);
