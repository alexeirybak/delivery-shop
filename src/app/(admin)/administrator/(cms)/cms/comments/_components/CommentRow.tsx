import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Ban } from "lucide-react";
import { checkAvatarExists } from "../../../../../../../../utils/avatarUtils";
import { getAvatarByGender } from "../../../../../../../../utils/getAvatarByGender";
import { CommentRowProps } from "../types/comments.types";
import { formatDate } from "../../../../../../../../utils/formatDate";
import { useCommentsStore } from "@/store/commentsStore";
import { BanUserModal } from "./BanUserModal";
import { banUser, checkBanStatus, unbanUser } from "@/actions/userBanActions";

export const CommentRow = ({
  comment,
  deletingId,
  onDelete,
}: CommentRowProps) => {
  const [avatarSrc, setAvatarSrc] = useState<string>("");
  const [authorGender, setAuthorGender] = useState<string>("");
  const [avatarLoading, setAvatarLoading] = useState(true);
  const [showBanModal, setShowBanModal] = useState(false);
  const { bannedUsers, setUserBanned } = useCommentsStore();
  const userBanInfo = bannedUsers[comment.authorId] || {
    isBanned: false,
    bannedUntil: null,
  };
  const isBanned = userBanInfo.isBanned;
  const bannedUntil = userBanInfo.bannedUntil;

  useEffect(() => {
    const checkBanStatusAction = async () => {
      if (!comment.authorId) return;
      if (bannedUsers[comment.authorId] !== undefined) return;

      try {
        const result = await checkBanStatus(comment.authorId);
        if (result.success) {
          setUserBanned(
            comment.authorId,
            result.isBanned ?? false,
            result.bannedUntil,
          );
        }
      } catch (error) {
        console.error("Ошибка проверки статуса бана:", error);
      }
    };

    checkBanStatusAction();
  }, [comment.authorId, bannedUsers, setUserBanned]);

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

  const handleBan = async (banDays: number | null) => {
    try {
      const result = await banUser(comment.authorId, banDays);

      if (result.success) {
        setUserBanned(comment.authorId, true, result.bannedUntil);
        alert(result.message);
      } else {
        alert(result.error || "Ошибка при блокировке пользователя");
      }
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Ошибка при блокировке пользователя");
    } finally {
      setShowBanModal(false);
    }
  };

  const handleUnban = async () => {
    try {
      const result = await unbanUser(comment.authorId);

      if (result.success) {
        setUserBanned(comment.authorId, false, null);
        alert(result.message);
      } else {
        alert(result.error || "Ошибка при разблокировке пользователя");
      }
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Ошибка при разблокировке пользователя");
    } finally {
      setShowBanModal(false);
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-[48px_90px_140px_100px_80px_100px] lg:grid-cols-[48px_120px_300px_120px_80px_120px] xl:grid-cols-[48px_160px_300px_150px_200px_140px] gap-2 lg:gap-4 px-2 py-3 items-center justify-center md:justify-between">
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

        <button
          onClick={() => setShowBanModal(true)}
          className="text-sm font-medium text-gray-900 hover:text-green-600 hover:underline text-left duration-300 cursor-pointer"
          title={
            isBanned
              ? "Пользователь заблокирован"
              : "Заблокировать пользователя"
          }
        >
          {comment.authorName}
          {isBanned && (
            <p className="text-[10px] text-red-600 text-left ">(заблокирован)</p>
          )}
        </button>

        <div className="text-sm text-gray-900">{comment.content}</div>

        <div className="text-sm">
          <span className="md:hidden">Статья: </span>
          <Link
            href={`/blog/${comment.categorySlug}/${comment.articleSlug}`}
            target="_blank"
            className="text-green-600 hover:text-green-800 hover:underline"
          >
            {comment.articleName}
          </Link>
        </div>

        <div className="text-sm text-gray-600 md:text-center">
          {formatDate(comment.createdAt)}
        </div>

        <div className="flex justify-center gap-1">
          <button
            onClick={() => setShowBanModal(true)}
            className={`p-1.5 ${
              isBanned
                ? "text-red-600 hover:text-red-800"
                : "text-gray-400 hover:text-red-600"
            } cursor-pointer duration-300`}
            title={
              isBanned ? "Управление блокировкой" : "Заблокировать пользователя"
            }
          >
            <Ban className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(comment._id)}
            disabled={deletingId === comment._id}
            className="p-1.5 text-gray-400 hover:text-red-600 disabled:opacity-50 cursor-pointer duration-300"
            title="Удалить комментарий"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <BanUserModal
        isOpen={showBanModal}
        onClose={() => setShowBanModal(false)}
        onBan={handleBan}
        onUnban={handleUnban}
        userName={comment.authorName}
        userId={comment.authorId}
        isBanned={isBanned}
        bannedUntil={bannedUntil}
      />
    </>
  );
};
