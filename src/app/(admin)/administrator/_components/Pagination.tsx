"use client";

import { useCategoryStore } from "@/store/categoryStore";
import { useArticlesManagementStore } from "@/store/articlesManagementStore";
import { useCommentsStore } from "@/store/commentsStore";
import { CONFIG_BLOG } from "../(cms)/cms/CONFIG_BLOG";
import { StoreType } from "../(cms)/cms/comments/types/comments.types";
import { useCardsStore } from "@/store/useCardsStore";

export const Pagination = ({ type = "categories" }) => {
  const stores: Record<string, StoreType> = {
    articles: useArticlesManagementStore(),
    categories: useCategoryStore(),
    comments: useCommentsStore(),
    cards: useCardsStore(),
  };

  const store = stores[type];

  if (!store) {
    console.error(`Неизвестный тип для пагинации: ${type}`);
    return null;
  }

  const { totalPages, totalItems, currentPage, itemsPerPage, setCurrentPage } =
    store;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
  };

  const renderPageButtons = () => {
    const buttons = [];
    const maxVisibleButtons = CONFIG_BLOG.MAX_VISIBLE_BUTTONS;

    if (totalPages <= maxVisibleButtons) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else if (currentPage <= 3) {
      for (let i = 1; i <= maxVisibleButtons; i++) {
        buttons.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - maxVisibleButtons + 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        buttons.push(i);
      }
    }

    return buttons.map((pageNum) => (
      <button
        key={pageNum}
        onClick={() => handlePageChange(pageNum)}
        className={`flex items-center justify-center w-11 h-11 px-4 py-2 border rounded cursor-pointer transition-custom ${
          currentPage === pageNum
            ? "bg-primary text-white border-primary hover:bg-primary"
            : "border-gray-300 hover:bg-gray-50"
        }`}
      >
        {pageNum}
      </button>
    ));
  };

  return (
    <div className="px-6 py-4 border-t border-gray-200">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="text-sm text-gray-700">
          Показано {startItem}-{endItem} из {totalItems} элементов
          <span className="mx-2">•</span>
          Страница <span className="font-medium">{currentPage}</span> из{" "}
          <span className="font-medium">{totalPages}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded disabled:opacity-50 cursor-pointer hover:bg-gray-50 transition-custom"
          >
            Назад
          </button>
          {renderPageButtons()}
          <button
            onClick={() =>
              handlePageChange(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded disabled:opacity-50 cursor-pointer hover:bg-gray-50 transition-custom"
          >
            Вперед
          </button>
        </div>
      </div>
    </div>
  );
};
