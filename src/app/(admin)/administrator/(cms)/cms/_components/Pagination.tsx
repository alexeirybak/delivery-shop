"use client";

import { useCategoryStore } from "@/store/categoryStore";
import { CONFIG_BLOG } from "../CONFIG_BLOG";
import { useArticlesManagementStore } from "@/store/articlesManagementStore";

export const Pagination = ({ type = "categories" }) => {
  const categoryStore = useCategoryStore();
  const articlesManagementStore = useArticlesManagementStore();

  const { totalPages, totalItems, currentPage, itemsPerPage, setCurrentPage } =
    type === "articles" ? articlesManagementStore : categoryStore;

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
        className={`flex items-center justify-center w-11 h-11 px-4 py-2 border rounded cursor-pointer duration-300 ${
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
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded disabled:opacity-50 cursor-pointer hover:bg-gray-50 duration-300"
          >
            Назад
          </button>
          {renderPageButtons()}
          <button
            onClick={() =>
              handlePageChange(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded disabled:opacity-50 cursor-pointer hover:bg-gray-50 duration-300"
          >
            Вперед
          </button>
        </div>
      </div>
    </div>
  );
};
