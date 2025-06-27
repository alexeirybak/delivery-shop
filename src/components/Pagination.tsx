"use client";

import { PaginationProps } from "@/types/paginationProps";
import Link from "next/link";

const createPageUrl = (
  basePath: string,
  params: URLSearchParams,
  page: number
) => {
  const newParams = new URLSearchParams(params);
  newParams.set("page", page.toString());
  return `${basePath}?${newParams.toString()}`;
};

const getVisiblePages = (totalPages: number, currentPage: number) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, currentPage + 2);

  if (currentPage <= 3) {
    end = 5;
  } else if (currentPage >= totalPages - 2) {
    start = totalPages - 4;
  }

  const pages: (number | string)[] = [];

  if (start > 1) pages.push(1);

  if (start > 2) pages.push("...");

  for (let i = start; i <= end; i++) pages.push(i);

  if (end < totalPages - 1) pages.push("...");

  if (end < totalPages) pages.push(totalPages);

  return pages;
};

const Pagination = ({
  totalItems,
  currentPage,
  basePath,
  itemsPerPage,
  searchQuery,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const params = new URLSearchParams(searchQuery);
  const visiblePages = getVisiblePages(totalPages, currentPage);

  const buttonSize =
    "w-5 h-5 md:w-10 md:h-10 flex items-center justify-center rounded duration-300";
  const buttonActive = "bg-[#ff6633] text-white hover:bg-[#ff6633]";
  const buttonDisabled = "bg-[#fcd5ba] cursor-not-allowed";
  const pageButtonClass = `border border-[#ff6633] ${buttonSize}`;

  return (
    <div className="flex justify-center mt-10 mb-20 text-white text-sm md:text-base">
      <nav className="flex gap-1 md:gap-2 items-center">
        <Link
          href={createPageUrl(basePath, params, 1)}
          aria-disabled={currentPage === 1}
          tabIndex={currentPage === 1 ? -1 : undefined}
          className={`${buttonSize} ${
            currentPage === 1 ? buttonDisabled : buttonActive
          }`}
        >
          &laquo;
        </Link>
        <Link
          href={createPageUrl(basePath, params, currentPage - 1)}
          aria-disabled={currentPage === 1}
          tabIndex={currentPage === 1 ? -1 : undefined}
          className={`${buttonSize} ${
            currentPage === 1 ? buttonDisabled : buttonActive
          }`}
        >
          &lsaquo;
        </Link>

        {visiblePages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className={`${buttonSize} text-[#ff6633]`}
              >
                ...
              </span>
            );
          }
          return (
            <Link
              key={page}
              href={createPageUrl(basePath, params, page as number)}
              className={`${pageButtonClass} ${
                currentPage === page
                  ? "bg-[#ff6633] text-white border-transparent"
                  : "text-[#ff6633] bg-white hover:bg-[#ff6633] hover:text-white hover:border-transparents"
              }`}
            >
              {page}
            </Link>
          );
        })}

        <Link
          href={createPageUrl(basePath, params, currentPage + 1)}
          aria-disabled={currentPage === totalPages}
          tabIndex={currentPage === totalPages ? -1 : undefined}
          className={`${buttonSize} ${
            currentPage === totalPages ? buttonDisabled : buttonActive
          }`}
        >
          &rsaquo;
        </Link>

        <Link
          href={createPageUrl(basePath, params, totalPages)}
          aria-disabled={currentPage === totalPages}
          tabIndex={currentPage === totalPages ? -1 : undefined}
          className={`${buttonSize} ${
            currentPage === totalPages ? buttonDisabled : buttonActive
          }`}
        >
          &raquo;
        </Link>
      </nav>
    </div>
  );
};

export default Pagination;
