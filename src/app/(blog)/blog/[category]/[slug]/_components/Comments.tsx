"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { CONFIG } from "../../../../../../../config/config";
import { IComment, SortOrder } from "../../../types";
import { Loader } from "@/components/Loader";
import { Eye } from "lucide-react";

export default function Comments({ articleId }: { articleId: string }) {
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(
    CONFIG.COMMENTS_PER_ARTICLE_PAGE,
  );

  const buildCommentTree = (flatComments: IComment[]): IComment[] => {
    console.log(flatComments);
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

    // Сортируем только при построении дерева, без учета порядка сортировки
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

  // Сортируем корневые комментарии в зависимости от выбранного порядка
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

  // Получаем видимые комментарии (первые N)
  const visibleComments = useMemo(() => {
    return sortedComments.slice(0, visibleCommentsCount);
  }, [sortedComments, visibleCommentsCount]);

  // Общее количество корневых комментариев
  const totalRootComments = comments.length;

  // Можно ли загрузить еще
  const hasMoreComments = visibleCommentsCount < totalRootComments;

  // Оставшееся количество комментариев
  const remainingComments = totalRootComments - visibleCommentsCount;

  const handleSortChange = (order: SortOrder) => {
    setSortOrder(order);
    // Сбрасываем количество видимых комментариев при смене сортировки
    setVisibleCommentsCount(CONFIG.COMMENTS_PER_ARTICLE_PAGE);
  };

  const handleLoadMore = () => {
    setVisibleCommentsCount((prev) => prev + CONFIG.COMMENTS_PER_ARTICLE_PAGE);
  };

  const handleCommentAdded = (newComment: IComment) => {
    if (newComment.parentId) {
      const updateComments = (commentList: IComment[]): IComment[] => {
        return commentList.map((comment) => {
          if (comment._id === newComment.parentId) {
            return {
              ...comment,
              replies: [...comment.replies, newComment],
            };
          }
          return {
            ...comment,
            replies: updateComments(comment.replies),
          };
        });
      };
      setComments((prev) => updateComments(prev));
    } else {
      setComments((prev) => [newComment, ...prev]);
    }
  };

  const handleCommentDeleted = (commentId: string) => {
    // Убираем fetch - запрос уже сделан в дочернем компоненте!

    // Просто обновляем состояние
    setComments((prevComments) => {
      const updateCommentInTree = (comments: IComment[]): IComment[] => {
        return comments.map((comment) => {
          if (comment._id === commentId) {
            // Помечаем комментарий как удаленный
            return {
              ...comment,
              content: "[Комментарий удален]",
              isDeleted: true,
              deletedAt: new Date().toISOString(),
            };
          }

          // Рекурсивно обрабатываем ответы
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateCommentInTree(comment.replies),
            };
          }

          return comment;
        });
      };

      return updateCommentInTree(prevComments);
    });
  };
  if (loading) return <Loader />;

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex flex-wrap items-center justify-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Комментарии {comments.length > 0 && `(${comments.length})`}
        </h2>

        {comments.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex rounded-full shadow-sm">
              <button
                onClick={() => handleSortChange("newest")}
                className={`px-4 py-2 text-sm font-medium rounded-l-full border cursor-pointer duration-300 ${
                  sortOrder === "newest"
                    ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Сначала новые
              </button>
              <button
                onClick={() => handleSortChange("oldest")}
                className={`px-4 py-2 text-sm font-medium rounded-r-full border-t border-b border-r cursor-pointer duration-30 ${
                  sortOrder === "oldest"
                    ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Сначала старые
              </button>
            </div>
          </div>
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
          onSuccess={handleCommentAdded}
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
                onReply={handleCommentAdded}
                onDelete={handleCommentDeleted}
                depth={0}
              />
            ))}

            {hasMoreComments && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-2.5 bg-orange-100 hover:bg-orange-200 text-gray-800 font-medium rounded-lg cursor-pointer duration-300 flex items-center gap-2"
                >
                  <Eye className="md:hidden w-6 h-6 text-orange-700" />
                  <span className="hidden md:inline-block text-orange-700">
                    Посмотреть еще
                  </span>
                  <span className="bg-orange-200 px-2 py-0.5 rounded-full text-xs text-orange-700">
                    {remainingComments}
                  </span>
                </button>
              </div>
            )}

            {!hasMoreComments && totalRootComments > 5 && (
              <div className="text-center pt-4 text-sm text-gray-500">
                Загружены все комментарии
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
