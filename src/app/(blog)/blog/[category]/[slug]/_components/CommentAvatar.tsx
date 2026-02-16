"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { checkAvatarExists } from "../../../../../../../utils/avatarUtils";
import { getAvatarByGender } from "../../../../../../../utils/getAvatarByGender";
import { CommentAvatarProps } from "../../../types";

export default function CommentAvatar({
  authorId,
  authorName,
}: CommentAvatarProps) {
  const [avatarSrc, setAvatarSrc] = useState<string>("");
  const [authorGender, setAuthorGender] = useState<string>("");
  const [avatarLoading, setAvatarLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorGender = async () => {
      if (!authorId) return;
      try {
        const response = await fetch(`/api/blog/user/${authorId}`);
        if (response.ok) {
          const data = await response.json();
          setAuthorGender(data.gender);
        }
      } catch (error) {
        console.error("Ошибка загрузки данных автора:", error);
      }
    };
    fetchAuthorGender();
  }, [authorId]);

  useEffect(() => {
    const loadAvatar = async () => {
      setAvatarLoading(true);
      if (authorId) {
        try {
          const exists = await checkAvatarExists(authorId);
          if (exists) {
            setAvatarSrc(`/api/auth/avatar/${authorId}`);
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
    if (authorGender || authorId) {
      loadAvatar();
    }
  }, [authorId, authorGender]);

  const handleAvatarError = () => {
    if (authorGender) {
      setAvatarSrc(getAvatarByGender(authorGender));
    } else {
      setAvatarSrc("/icons-avatar/avatar-default.svg");
    }
  };

  return (
    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
      {avatarLoading ? (
        <div className="w-full h-full bg-gray-200 animate-pulse" />
      ) : (
        <Image
          src={avatarSrc || "/icons-avatar/avatar-default.svg"}
          alt={authorName}
          width={32}
          height={32}
          className="w-full h-full object-cover"
          onError={handleAvatarError}
        />
      )}
    </div>
  );
}
