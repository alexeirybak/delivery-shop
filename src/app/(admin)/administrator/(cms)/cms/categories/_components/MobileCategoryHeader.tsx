import React from "react";
import { MobileCategoryHeaderProps } from "../../types/categories";

export const MobileCategoryHeader: React.FC<MobileCategoryHeaderProps> = ({
  category,
  displayNumericId,
}) => (
  <div className="flex-1 min-w-0">
    <div className="flex items-center gap-2 mb-1">
      <span
        className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-xs font-medium shrink-0"
        title="Порядковый номер"
      >
        {displayNumericId || "—"}
      </span>
      <h3
        className="font-medium text-gray-900 text-lg wrap-break-word"
        title={category.name}
      >
        {category.name}
      </h3>
    </div>

    <div className="flex flex-wrap items-center gap-2 mt-2">
      <code
        className="text-xs bg-gray-100 px-2 py-1 rounded font-mono break-all"
        title="Ссылка (slug)"
      >
        {category.slug}
      </code>
      <span
        className="text-xs text-gray-500 shrink-0"
        title={`Дата создания: ${new Date(category.createdAt).toLocaleDateString("ru-RU")}`}
      >
        {new Date(category.createdAt).toLocaleDateString("ru-RU")}
      </span>
    </div>
  </div>
);
