"use client";

import { useCategoryStore } from "@/store/categoryStore";
import { CONFIG_CATEGORIES } from "../../records/utils/CONFIG_CATEGORIES";
import { useRecordsManagementStore } from "@/store/recordsManagementStore";
import "../../styles/pagination.css";

type StoreType = {
  totalPages: number;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
};

export const Pagination = ({ type }: { type: string }) => {
  const stores: Record<string, StoreType> = {
    records: useRecordsManagementStore(),
    categories: useCategoryStore(),
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
    const maxVisibleButtons = CONFIG_CATEGORIES.MAX_VISIBLE_BUTTONS;

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
        className={`pagination-page-btn ${
          currentPage === pageNum ? "pagination-page-btn-active" : ""
        }`}
      >
        {pageNum}
      </button>
    ));
  };

  return (
    <div className="pagination-container">
      <div className="pagination-wrapper">
        <div className="pagination-info">
          Показано {startItem}-{endItem} из {totalItems} элементов
          <span className="pagination-info-separator">•</span>
          Страница <span className="pagination-info-number">
            {currentPage}
          </span>{" "}
          из <span className="pagination-info-number">{totalPages}</span>
        </div>
        <div className="pagination-buttons">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="pagination-nav-btn"
          >
            Назад
          </button>
          {renderPageButtons()}
          <button
            onClick={() =>
              handlePageChange(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="pagination-nav-btn"
          >
            Вперед
          </button>
        </div>
      </div>
    </div>
  );
};
