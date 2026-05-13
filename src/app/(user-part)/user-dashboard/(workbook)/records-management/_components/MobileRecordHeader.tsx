import { MobileRecordHeaderProps } from "../types";
import "./../styles/mobile-record-header.css";

export const MobileRecordHeader = ({
  record,
  displayNumericId,
}: MobileRecordHeaderProps) => {
  const formattedDate = new Date(record.createdAt).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="mobile-record-header">
      <div className="mobile-record-header-top">
        <span className="mobile-record-header-id" title="Порядковый номер">
          {displayNumericId || "—"}
        </span>
        <h3 className="mobile-record-header-title" title={record.name}>
          {record.name}
        </h3>
      </div>

      <div className="mobile-record-header-category">
        <div className="mobile-record-header-category-badge" title="Категория">
          {record.categoryName}
        </div>
        <div className="mobile-record-header-date" title="Дата создания">
          {formattedDate}
        </div>
      </div>
    </div>
  );
};
