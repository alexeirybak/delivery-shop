"use client";

import { useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import CommentEditForm from "./CommentEditForm";
import { CommentItemProps, UserRole } from "../../../types";
import { useAuthStore } from "@/store/authStore";
import { getDeleteButtonTitle } from "../utils/getDeleteButtonTitle";
import CommentHeader from "./CommentHeader";
import CommentActions from "./CommentActions";
import CommentReplies from "./CommentReplies";

export default function CommentItem({
  comment,
  articleId,
  onCommentChange,
  depth,
}: CommentItemProps) {
  const { user } = useAuthStore();
  const currentUserId = user?.id || user?._id;
  const currentUserRole = (user?.role as UserRole) || "user";

  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [liking, setLiking] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [currentContent, setCurrentContent] = useState(comment.content);

  const [isLiked, setIsLiked] = useState(
    currentUserId ? comment.likes.includes(currentUserId) : false,
  );
  const [likeCount, setLikeCount] = useState(comment.likes.length);

    useEffect(() => {
    // Обновляем контент
    setCurrentContent(comment.content);

    // Обновляем лайки
    setIsLiked(currentUserId ? comment.likes.includes(currentUserId) : false);
    setLikeCount(comment.likes.length);
  }, [comment, currentUserId]);

  const isAdminOrManager =
    currentUserRole === "admin" || currentUserRole === "manager";

  const canDelete = Boolean(
    (currentUserId && currentUserId === comment.authorId) || isAdminOrManager,
  );

  const canEdit = currentUserId === comment.authorId;
  const canReply = depth < 3;

  const handleLike = async () => {
    if (!currentUserId || liking) return;
    try {
      setLiking(true);
      const response = await fetch(`/api/comments/${comment._id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      });
      if (response.ok) {
        const data = await response.json();
        setLikeCount(data.likeCount);
        setIsLiked(data.liked);
      }
    } catch (error) {
      console.error("Ошибка при лайке:", error);
    } finally {
      setLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!canDelete || deleting) return;
    if (!confirm("Удалить этот комментарий?")) return;
    try {
      setDeleting(true);
      const response = await fetch(`/api/comments/${comment._id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        onCommentChange();
      }
    } catch (error) {
      console.error("Ошибка при удалении:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleReplySuccess = () => {
    onCommentChange();
    setShowReplyForm(false);
  };

  const handleEditSuccess = (newContent: string, editedAt: string) => {
    setCurrentContent(newContent);
    comment.content = newContent;
    comment.isEdited = true;
    comment.editedAt = editedAt;
    setIsEditing(false);
  };

  return (
    <div
      className={`${depth > 0 ? "ml-4 md:ml-8 pl-4 border-l-2 border-gray-200" : ""}`}
    >
      <div className="bg-white rounded p-4 mb-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <CommentHeader
          comment={comment}
          canEdit={canEdit}
          canDelete={canDelete}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onDelete={handleDelete}
          deleting={deleting}
          deleteButtonTitle={getDeleteButtonTitle(
            currentUserId!,
            currentUserRole,
            comment.authorId,
          )}
        />

        <div className="mb-3">
          {isEditing ? (
            <CommentEditForm
              commentId={comment._id}
              initialContent={currentContent}
              userId={currentUserId || ""}
              onSuccess={handleEditSuccess}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <p className="text-gray-800 whitespace-pre-wrap wrap-break-word">
              {currentContent}
            </p>
          )}
        </div>

        <CommentActions
          isLiked={isLiked}
          likeCount={likeCount}
          canReply={canReply}
          onLike={handleLike}
          onReply={() => setShowReplyForm(!showReplyForm)}
          liking={liking}
          currentUserId={currentUserId}
        />
      </div>

      {showReplyForm && canReply && (
        <div className="mb-4 ml-4">
          <CommentForm
            articleId={articleId}
            parentId={comment._id}
            onSuccess={handleReplySuccess}
            placeholder={`Ответ ${comment.authorName}...`}
          />
        </div>
      )}

      <CommentReplies
        replies={comment.replies}
        articleId={articleId}
        depth={depth}
        onCommentChange={onCommentChange}
      />
    </div>
  );
}
