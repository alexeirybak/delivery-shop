"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { CommentsPaginationProps } from "../types/comments.types";

export default function CommentsPagination({
  page,
  totalPages,
  onPageChange,
}: CommentsPaginationProps) {
  return (
    <div className="flex items-center justify-between px-4 py-4 mt-4 border border-gray-200 rounded bg-white">
      <div className="text-sm text-gray-600">
        Страница {page} из {totalPages}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer duration-300"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
