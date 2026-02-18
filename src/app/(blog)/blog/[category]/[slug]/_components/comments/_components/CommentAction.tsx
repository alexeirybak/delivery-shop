"use client";

import { Heart, Reply } from "lucide-react";
import { CommentActionsProps } from "@/app/(blog)/blog/types/comments.types";

export const CommentActions = ({
  isLiked,
  likeCount,
  onLike,
  liking,
  currentUserId,
  canReply,
  onReply
}: CommentActionsProps) => {
  return (
    <div className="flex items-center gap-4 text-sm">
      <button
        onClick={onLike}
        disabled={liking || !currentUserId}
        className={`flex items-center gap-1 cursor-pointer duration-300 ${
          isLiked ? "text-red-600" : "text-gray-500 hover:text-red-600"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
        <span>{likeCount}</span>
      </button>
      {canReply && (
        <button
          onClick={onReply}
          className="text-gray-500 hover:text-green-600 flex items-center gap-1 cursor-pointer duration-300"
        >
          <Reply className="w-4 h-4" />
          Ответить
        </button>
      )}
    </div>
  );
};
