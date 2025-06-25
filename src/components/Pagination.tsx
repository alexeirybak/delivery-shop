"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

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

  const buttonSize = "w-5 h-5 md:w-10 md:h-10 flex items-center justify-center rounded duration-300";
  const activeClass = "bg-[#ff6633] text-white hover:bg-[#ff6633]";
  const disabledClass = "bg-[#fcd5ba] cursor-not-allowed";
  const pageButtonClass = `border border-[#ff6633] ${buttonSize}`;

  const createPageUrl = (page: number) => {
    const newParams = new URLSearchParams(params);
    newParams.set("page", page.toString());
    return `${basePath}?${newParams.toString()}`;
  };

  const getVisiblePages = () => {
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

  const renderButton = (content: React.ReactNode, page: number, disabled: boolean) => (
    <Link
      href={createPageUrl(page)}
      className={`${buttonSize} ${disabled ? disabledClass : activeClass}`}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
    >
      {content}
    </Link>
  );

  return (
    <div className="flex justify-center mt-10 mb-20 text-white text-sm md:text-base">
      <nav className="flex gap-1 md:gap-2 items-center">
        {renderButton("«", 1, currentPage === 1)}
        {renderButton("‹", currentPage - 1, currentPage === 1)}

        {getVisiblePages().map((page, index) => {
          if (page === "...") {
            return <span key={`ellipsis-${index}`} className={`${buttonSize} text-[#ff6633]`}>...</span>;
          }

          return (
            <Link
              key={page}
              href={createPageUrl(page as number)}
              className={`${pageButtonClass} ${
                currentPage === page
                  ? "bg-[#ff6633] text-white border-transparent"
                  : "text-[#ff6633] bg-white hover:bg-[#ff6633] hover:text-white hover:border-transparent"
              }`}
            >
              {page}
            </Link>
          );
        })}

        {renderButton("›", currentPage + 1, currentPage === totalPages)}
        {renderButton("»", totalPages, currentPage === totalPages)}
      </nav>
    </div>
  );
}