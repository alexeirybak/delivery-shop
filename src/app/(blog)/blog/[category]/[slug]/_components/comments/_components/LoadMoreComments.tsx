"use client";

import { LoadMoreCommentsProps } from "@/app/(blog)/blog/types/comments.types";
import { Eye } from "lucide-react";

export const LoadMoreComments = ({
  hasMore,
  remainingCount,
  onLoadMore,
  totalRootComments,
}: LoadMoreCommentsProps) => {
  return (
    <>
      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onLoadMore}
            className="px-6 py-2.5 bg-orange-100 hover:bg-orange-200 text-gray-800 font-medium rounded-lg cursor-pointer transition-custom flex items-center gap-2"
          >
            <Eye className="md:hidden w-6 h-6 text-orange-700" />
            <span className="hidden md:inline-block text-orange-700">
              Посмотреть еще
            </span>
            <span className="flex items-center justify-center bg-orange-200 px-2 py-0.5 rounded-full text-xs text-orange-700">
              {remainingCount}
            </span>
          </button>
        </div>
      )}

      {!hasMore && totalRootComments > 5 && (
        <div className="text-center pt-4 text-sm text-gray-500">
          Загружены все комментарии
        </div>
      )}
    </>
  );
};
