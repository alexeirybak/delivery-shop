"use client";

import { memo } from "react";
import { SortOrder } from "../../../types";

interface CommentSortButtonsProps {
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
}

export const CommentSortButtons = memo(({ 
  sortOrder, 
  onSortChange 
}: CommentSortButtonsProps) => {
  console.log("Рендер CommentSortButtons"); // Для отладки

  return (
    <div className="flex rounded-full shadow-sm">
      <button
        onClick={() => onSortChange("newest")}
        className={`
          px-4 py-2 text-sm font-medium rounded-l-full border cursor-pointer duration-300
          ${sortOrder === "newest"
            ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }
        `}
        aria-pressed={sortOrder === "newest"}
      >
        Сначала новые
      </button>
      <button
        onClick={() => onSortChange("oldest")}
        className={`
          px-4 py-2 text-sm font-medium rounded-r-full border-t border-b border-r cursor-pointer duration-300
          ${sortOrder === "oldest"
            ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }
        `}
        aria-pressed={sortOrder === "oldest"}
      >
        Сначала старые
      </button>
    </div>
  );
});

CommentSortButtons.displayName = "CommentSortButtons";