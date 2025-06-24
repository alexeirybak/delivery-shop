"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import iconRight from "/public/icons-products/icon-arrow-right.svg";
import IconDoubleLeft from "./svg/IconDoubleLeft";
import IconDoubleRight from "./svg/IconDoubleRight";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number; 
  currentPage: number;
  basePath: string;
}

export default function Pagination({
  totalItems,
  itemsPerPage,
  currentPage,
  basePath,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  
  const baseButtonClass = "p-2 w-6 h-6 md:w-14 md:h-14 rounded flex items-center justify-center duration-300";
  const activeButtonClass = "bg-[#ff6633] text-white hover:bg-(--color-primary) active:bg-[#d80000] cursor-pointer";
  const disabledButtonClass = "bg-[#fcd5ba] cursor-not-allowed";
  const pageButtonClass = "text-xs md:text-base p-2 w-6 h-6 md:p-4 md:w-14 md:h-14 rounded flex items-center justify-center duration-300 cursor-pointer";
  const iconClass = "w-4 h-4 md:w-6 md:h-6";
  const ellipsisClass = "text-xs md:text-base p-2 w-6 h-6 md:p-4 md:w-14 md:h-14 flex items-center justify-center text-[#ff6633]";

  const buttonClass = (disabled: boolean) =>
    `${baseButtonClass} ${disabled ? disabledButtonClass : activeButtonClass}`;

  // Генерация массива страниц с многоточиями
  const getVisiblePages = () => {
    const visiblePages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      visiblePages.push(1);
      if (start > 2) {
        visiblePages.push("...");
      }
    }

    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        visiblePages.push("...");
      }
      visiblePages.push(totalPages);
    }

    return visiblePages;
  };

  return (
    <div className="flex justify-center mt-10 mb-20">
      <nav className="flex gap-2 items-center">
        {/* Кнопка "В начало" */}
        <Link
          href={`${basePath}?${(() => {
            params.set("page", "1");
            return params.toString();
          })()}`}
          className={buttonClass(currentPage === 1)}
          aria-disabled={currentPage === 1}
          tabIndex={currentPage === 1 ? -1 : undefined}
        >
          <IconDoubleLeft className={iconClass} />
        </Link>

        {/* Кнопка "Назад" */}
        <Link
          href={`${basePath}?${(() => {
            params.set("page", Math.max(1, currentPage - 1).toString());
            return params.toString();
          })()}`}
          className={buttonClass(currentPage === 1)}
          aria-disabled={currentPage === 1}
          tabIndex={currentPage === 1 ? -1 : undefined}
        >
          <Image
            src={iconRight}
            alt="Предыдущая страница"
            width={24}
            height={24}
            className={`${iconClass} rotate-180`}
          />
        </Link>

        {/* Номера страниц с многоточиями */}
        {getVisiblePages().map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className={ellipsisClass}
              >
                ...
              </span>
            );
          }

          params.set("page", page.toString());
          return (
            <Link
              key={page}
              href={`${basePath}?${params.toString()}`}
              className={`${pageButtonClass} ${
                currentPage === page
                  ? "bg-[#ff6633] hover:shadow-(--shadow-button-secondary) text-white"
                  : "text-[#ff6633] bg-white border-1 border-[#ff6633] hover:bg-(--color-primary) hover:border-none hover:text-white active:bg-[#d80000]"
              }`}
            >
              {page}
            </Link>
          );
        })}

        {/* Кнопка "Вперед" */}
        <Link
          href={`${basePath}?${(() => {
            params.set(
              "page",
              Math.min(totalPages, currentPage + 1).toString()
            );
            return params.toString();
          })()}`}
          className={buttonClass(currentPage === totalPages)}
          aria-disabled={currentPage === totalPages}
          tabIndex={currentPage === totalPages ? -1 : undefined}
        >
          <Image
            src={iconRight}
            alt="Следующая страница"
            width={24}
            height={24}
            className={iconClass}
          />
        </Link>

        {/* Кнопка "В конец" */}
        <Link
          href={`${basePath}?${(() => {
            params.set("page", totalPages.toString());
            return params.toString();
          })()}`}
          className={buttonClass(currentPage === totalPages)}
          aria-disabled={currentPage === totalPages}
          tabIndex={currentPage === totalPages ? -1 : undefined}
        >
          <IconDoubleRight/>
        </Link>
      </nav>
    </div>
  );
}