"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { CommentSortButtons } from "./CommentSortButtons";
import { LoadMoreComments } from "./LoadMoreComments"; // Импортируем
import { CONFIG } from "../../../../../../../config/config";
import { IComment, SortOrder } from "../../../types";
import { Loader } from "@/components/Loader";

export default function Comments({ articleId }: { articleId: string }) {
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(
    CONFIG.COMMENTS_PER_ARTICLE_PAGE,
  );

  const buildCommentTree = (flatComments: IComment[]): IComment[] => {
    const commentMap = new Map<string, IComment>();
    const rootComments: IComment[] = [];

    flatComments.forEach((comment) => {
      commentMap.set(comment._id, { ...comment, replies: [] });
    });

    flatComments.forEach((comment) => {
      const node = commentMap.get(comment._id);
      if (!node) return;

      if (comment.parentId && commentMap.has(comment.parentId)) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(node);
        }
      } else {
        rootComments.push(node);
      }
    });

    return rootComments.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  };

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/comments?articleId=${articleId}`);

      if (!response.ok) {
        throw new Error("Не удалось загрузить комментарии");
      }

      const data = await response.json();
      const commentTree = buildCommentTree(data.comments || []);
      setComments(commentTree);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    if (articleId) {
      fetchComments();
    }
  }, [articleId, fetchComments]);

  const sortedComments = useMemo(() => {
    const sorted = [...comments];

    if (sortOrder === "newest") {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else {
      sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    }

    return sorted;
  }, [comments, sortOrder]);

  const visibleComments = useMemo(() => {
    return sortedComments.slice(0, visibleCommentsCount);
  }, [sortedComments, visibleCommentsCount]);

  const totalRootComments = comments.length;
  const hasMoreComments = visibleCommentsCount < totalRootComments;
  const remainingComments = totalRootComments - visibleCommentsCount;

  const handleSortChange = (order: SortOrder) => {
    setSortOrder(order);
    setVisibleCommentsCount(CONFIG.COMMENTS_PER_ARTICLE_PAGE);
  };

  const handleLoadMore = () => {
    setVisibleCommentsCount((prev) => prev + CONFIG.COMMENTS_PER_ARTICLE_PAGE);
  };

  const handleCommentChange = () => {
    fetchComments();
  };

  if (loading) return <Loader />;

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex flex-wrap items-center justify-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Комментарии {comments.length > 0 && `(${comments.length})`}
        </h2>

        {comments.length > 0 && (
          <CommentSortButtons 
            sortOrder={sortOrder} 
            onSortChange={handleSortChange} 
          />
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="mb-8">
        <CommentForm
          articleId={articleId}
          parentId={null}
          onSuccess={handleCommentChange}
        />
      </div>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Пока нет комментариев. Будьте первым!
          </div>
        ) : (
          <>
            {visibleComments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                articleId={articleId}
                onCommentChange={handleCommentChange}
                depth={0}
              />
            ))}

            <LoadMoreComments
              hasMore={hasMoreComments}
              remainingCount={remainingComments}
              onLoadMore={handleLoadMore}
              totalRootComments={totalRootComments}
            />
          </>
        )}
      </div>
    </div>
  );
}