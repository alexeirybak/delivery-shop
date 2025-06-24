"use client";

import { usePathname } from "next/navigation";
import PaginationButton from "./PaginationButton";

interface PaginationControlsProps {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
}

export default function PaginationControls({
  totalItems,
  currentPage,
  itemsPerPage,
}: PaginationControlsProps) {
  const pathname = usePathname();
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-10 mb-20">
      <div className="flex items-center gap-1">
        {/* Первая страница */}
        <PaginationButton
          href={`${pathname}?page=1`}
          disabled={currentPage === 1}
        >
          &laquo;
        </PaginationButton>

        {/* Предыдущая страница */}
        <PaginationButton
          href={`${pathname}?page=${currentPage - 1}`}
          disabled={currentPage === 1}
        >
          &lsaquo;
        </PaginationButton>

        {/* Номера страниц */}
        {currentPage > 2 && (
          <PaginationButton href={`${pathname}?page=1`}>1</PaginationButton>
        )}

        {currentPage > 3 && <span className="px-3 py-2">...</span>}

        {currentPage > 1 && (
          <PaginationButton href={`${pathname}?page=${currentPage - 1}`}>
            {currentPage - 1}
          </PaginationButton>
        )}

        {/* Текущая страница */}
        <PaginationButton href={`${pathname}?page=${currentPage}`} active>
          {currentPage}
        </PaginationButton>

        {currentPage < totalPages && (
          <PaginationButton href={`${pathname}?page=${currentPage + 1}`}>
            {currentPage + 1}
          </PaginationButton>
        )}

        {currentPage < totalPages - 2 && <span className="px-3 py-2">...</span>}

        {currentPage < totalPages - 1 && (
          <PaginationButton href={`${pathname}?page=${totalPages}`}>
            {totalPages}
          </PaginationButton>
        )}

        {/* Следующая страница */}
        <PaginationButton
          href={`${pathname}?page=${currentPage + 1}`}
          disabled={currentPage === totalPages}
        >
          &rsaquo;
        </PaginationButton>

        {/* Последняя страница */}
        <PaginationButton
          href={`${pathname}?page=${totalPages}`}
          disabled={currentPage === totalPages}
        >
          &raquo;
        </PaginationButton>
      </div>
    </div>
  );
}