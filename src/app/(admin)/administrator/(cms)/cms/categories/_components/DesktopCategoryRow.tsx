import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { SortableItemProps } from "../types";
import { DragHandle } from "../../_components/DragHandle";

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
  return (
    <div
      className={`p-4 hover:bg-gray-50 text-sm duration-200 ${
        isDragging
          ? "opacity-60 bg-linear-to-r from-blue-50 to-green-50 shadow-lg border-2 border-green-400 transform scale-[0.995]"
          : "hover:shadow-sm"
      }`}
    >
      <div className="grid grid-cols-[0.3fr_0.5fr_1fr_2fr_2fr_2fr_2fr_1fr_1fr_2fr] gap-2 items-center">
        <div>
          <DragHandle />
        </div>

        <div className="flex justify-center">
          <span
            className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-xs font-medium shrink-0"
            title="Порядковый номер"
          >
            {displayNumericId || "-"}
          </span>
        </div>

        <div className="flex items-center justify-center">
          {showImage ? (
            <Image
              src={category.image}
              alt={category.imageAlt || category.name}
              width={50}
              height={50}
              className="object-cover rounded border border-gray-200"
              title={category.imageAlt}
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-gray-400 text-xs">Нет</span>
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div
            className="font-medium text-gray-900 wrap-break-words"
            title={category.name}
          >
            {category.name}
          </div>
        </div>

        <div className="min-w-0">
          <div
            className="text-xs bg-gray-100 px-2 py-1 rounded break-all font-mono"
            title={`Ссылка: ${category.slug}`}
          >
            {category.slug}
          </div>
        </div>

        <div className="min-w-0">
          <div
            className="text-gray-600 wrap-break-words"
            title={category.description || "Нет описания"}
          >
            {category.description || <span className="text-gray-400">—</span>}
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap gap-1 justify-center">
            {category.keywords && category.keywords.length > 0 ? (
              category.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-1 rounded wrap-break-word max-w-full"
                  title={keyword}
                >
                  {keyword}
                </span>
              ))
            ) : (
              <span
                className="text-gray-400 text-center"
                title="Нет ключевых слов"
              >
                —
              </span>
            )}
          </div>
        </div>

        <div className="min-w-0 flex justify-center">
          <div
            className="text-gray-600 text-xs wrap-break-word text-center"
            title={category.author || "Автор неизвестен"}
          >
            {category.author || <span className="text-gray-400">—</span>}
          </div>
        </div>

        <div className="min-w-0">
          <div
            className="text-gray-600 text-xs wrap-break-word"
            title={`Дата создания: ${new Date(category.createdAt).toLocaleDateString("ru-RU")}`}
          >
            {new Date(category.createdAt).toLocaleDateString("ru-RU")}
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex gap-2 justify-center">
            <button
              onClick={handleEdit}
              className="p-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center cursor-pointer duration-300 shrink-0"
              title="Редактировать категорию"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center cursor-pointer duration-300 shrink-0"
              title="Удалить категорию"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};