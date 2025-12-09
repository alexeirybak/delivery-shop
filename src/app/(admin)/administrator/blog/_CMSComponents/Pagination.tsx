"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChangeAction: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChangeAction,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const renderPageButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;

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
        onClick={() => onPageChangeAction(pageNum)}
        className={`px-4 py-2 border rounded cursor-pointer transition-colors ${
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
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Показано {startItem}-{endItem} из {totalItems} статей
          <span className="mx-2">•</span>
          Страница <span className="font-medium">{currentPage}</span> из{" "}
          <span className="font-medium">{totalPages}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChangeAction(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            Назад
          </button>
          {renderPageButtons()}
          <button
            onClick={() => onPageChangeAction(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            Вперед
          </button>
        </div>
      </div>
    </div>
  );
}
