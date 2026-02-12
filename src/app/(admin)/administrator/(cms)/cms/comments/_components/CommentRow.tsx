"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { checkAvatarExists } from "../../../../../../../../utils/avatarUtils";
import { getAvatarByGender } from "../../../../../../../../utils/getAvatarByGender";
import { CommentRowProps } from "../types/comments.types";
import { formatDate } from "../../../../../../../../utils/formatDate";

export const CommentRow = ({
  comment,
  deletingId,
  onDelete,
}: CommentRowProps) => {
  const [avatarSrc, setAvatarSrc] = useState<string>("");
  const [authorGender, setAuthorGender] = useState<string>("");
  const [avatarLoading, setAvatarLoading] = useState(true);

  // Получаем пол автора комментария из БД - ТОЧНО КАК В CommentItem
  useEffect(() => {
    const fetchAuthorGender = async () => {
      if (!comment.authorId) return;

      try {
        const response = await fetch(`/api/blog/user/${comment.authorId}`);
        if (response.ok) {
          const data = await response.json();
          setAuthorGender(data.gender);
        }
      } catch (error) {
        console.error("Ошибка загрузки данных автора:", error);
      }
    };

    fetchAuthorGender();
  }, [comment.authorId]);

  useEffect(() => {
    const loadAvatar = async () => {
      setAvatarLoading(true);

      if (comment.authorId) {
        try {
          const exists = await checkAvatarExists(comment.authorId);
          if (exists) {
            setAvatarSrc(`/api/auth/avatar/${comment.authorId}`);
          } else if (authorGender) {
            setAvatarSrc(getAvatarByGender(authorGender));
          }
        } catch {
          if (authorGender) {
            setAvatarSrc(getAvatarByGender(authorGender));
          }
        }
      }

      setAvatarLoading(false);
    };

    if (authorGender || comment.authorId) {
      loadAvatar();
    }
  }, [comment.authorId, authorGender]);

  const handleAvatarError = () => {
    if (authorGender) {
      setAvatarSrc(getAvatarByGender(authorGender));
    } else {
      setAvatarSrc("/icons-avatar/avatar-default.svg");
    }
  };

  return (
    <div className="grid md:grid-cols-[48px_75px_140px_100px_80px_60px] lg:grid-cols-[48px_120px_300px_120px_80px_80px] xl:grid-cols-[48px_160px_300px_150px_200px_100px] gap-2 lg:gap-4 px-2 py-3 items-center justify-center md:justify-between">
      <div className="flex justify-center overflow-hidden shrink-0">
        <div className="w-8 h-8 rounded-full overflow-hidden">
          {avatarLoading ? (
            <div className="w-full h-full bg-gray-200 animate-pulse" />
          ) : (
            <Image
              src={avatarSrc || "/icons-avatar/avatar-default.svg"}
              alt={comment.authorName}
              width={32}
              height={32}
              className="w-full h-full object-cover"
              onError={handleAvatarError}
            />
          )}
        </div>
      </div>

      {/* Имя автора */}
      <div className="text-sm font-medium text-gray-900">
        {comment.authorName}
      </div>

      {/* Текст комментария */}
      <div className="text-sm text-gray-900">{comment.content}</div>

      {/* Ссылка на статью */}
      <div className="text-sm">
        <span className="md:hidden">Статья:{" "}</span>
        <Link
          href={`/blog/${comment.categorySlug}/${comment.articleSlug}`}
          target="_blank"
          className="text-green-600 hover:text-green-800 hover:underline"
        >
          {comment.articleName}
        </Link>
      </div>

      {/* Дата */}
      <div className="text-sm text-gray-600 md:text-center">
        {formatDate(comment.createdAt)}
      </div>

      {/* Кнопка удаления */}
      <div className="flex justify-center">
        <button
          onClick={() => onDelete(comment._id)}
          disabled={deletingId === comment._id}
          className="p-1.5 text-gray-400 hover:text-red-600 disabled:opacity-50 cursor-pointer duration-300"
          title="Удалить"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
