"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CommentRepliesProps, IComment } from "../../../types";
import { getReplyWord } from "../utils/getReplayWord";
import CommentItem from "./CommentItem";

export default function CommentReplies({
  replies,
  articleId,
  depth,
  onReply,
  onDelete,
}: CommentRepliesProps) {
  const [showReplies, setShowReplies] = useState(false);

  if (!replies.length) return null;

  return (
    <div className="mt-2">
      <button
        onClick={() => setShowReplies(!showReplies)}
        className="flex items-center gap-1 text-sm text-green-600 hover:text-green-800 mb-2 cursor-pointer duration-300"
      >
        {showReplies ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
        <span>
          {replies.length} {getReplyWord(replies.length)}
        </span>
      </button>

      {showReplies && (
        <div className="space-y-4">
          {replies.map((reply: IComment) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              articleId={articleId}
              onReply={onReply}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
