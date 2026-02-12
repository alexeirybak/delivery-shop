"use client";

import { useState, useEffect, useCallback } from "react";
import CommentsTableHeader from "./_components/CommentsTableHeader";
import { DateFilter } from "./_components/DateFilter";
import CommentsList from "./_components/CommentsList";
import CommentsPagination from "./_components/CommentsPagination";
import { IComment } from "@/app/(blog)/blog/types";
import { checkAvatarExists } from "../../../../../../../utils/avatarUtils";
import { getAvatarByGender } from "../../../../../../../utils/getAvatarByGender";
import { CONFIG } from "../../../../../../../config/config";

export default function CommentsPage() {
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("");

  const [avatars, setAvatars] = useState<Record<string, string>>({});
  const [authorGenders, setAuthorGenders] = useState<Record<string, string>>(
    {},
  );
  const [avatarLoading, setAvatarLoading] = useState<Record<string, boolean>>(
    {},
  );

  const limit = CONFIG.COMMENTS_PER_COMMENT_PAGE;

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getDaysAgo = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split("T")[0];
  };

  const setToday = () => {
    const today = getTodayDate();
    setDateFrom(today);
    setDateTo(today);
    setPage(1);
    setActiveFilter("today");
  };

  const setLast3Days = () => {
    setDateFrom(getDaysAgo(3));
    setDateTo(getTodayDate());
    setPage(1);
    setActiveFilter("3days");
  };

  const setLastWeek = () => {
    setDateFrom(getDaysAgo(7));
    setDateTo(getTodayDate());
    setPage(1);
    setActiveFilter("week");
  };

  const setLastMonth = () => {
    setDateFrom(getDaysAgo(30));
    setDateTo(getTodayDate());
    setPage(1);
    setActiveFilter("month");
  };

  const clearFilters = () => {
    setDateFrom("");
    setDateTo("");
    setPage(1);
    setActiveFilter("");
  };

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (dateFrom) params.append("dateFrom", dateFrom);
      if (dateTo) params.append("dateTo", dateTo);

      const res = await fetch(`/administrator/cms/api/comments?${params}`);
      const data = await res.json();

      setComments(data.comments || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo, limit, page]);

  useEffect(() => {
    fetchComments();
  }, [page, dateFrom, dateTo, fetchComments]);

  // Получаем пол авторов комментариев из БД
  useEffect(() => {
    const fetchAuthorGenders = async () => {
      const newGenders: Record<string, string> = {};

      for (const comment of comments) {
        if (authorGenders[comment.authorId]) continue;

        try {
          const response = await fetch(`/api/blog/user/${comment.authorId}`);
          if (response.ok) {
            const data = await response.json();
            newGenders[comment.authorId] = data.gender;
          }
        } catch (error) {
          console.error("Ошибка загрузки данных автора:", error);
        }
      }

      if (Object.keys(newGenders).length > 0) {
        setAuthorGenders((prev) => ({ ...prev, ...newGenders }));
      }
    };

    if (comments.length > 0) fetchAuthorGenders();
  }, [authorGenders, comments]);

  // Загружаем аватарки
  useEffect(() => {
    const loadAvatars = async () => {
      const newAvatars: Record<string, string> = {};

      for (const comment of comments) {
        if (avatars[comment.authorId]) continue;

        setAvatarLoading((prev) => ({ ...prev, [comment.authorId]: true }));

        try {
          const exists = await checkAvatarExists(comment.authorId);
          if (exists) {
            newAvatars[comment.authorId] =
              `/api/auth/avatar/${comment.authorId}`;
          } else {
            const gender = authorGenders[comment.authorId];
            newAvatars[comment.authorId] = getAvatarByGender(gender);
          }
        } catch {
          const gender = authorGenders[comment.authorId];
          newAvatars[comment.authorId] = getAvatarByGender(gender);
        }

        setAvatarLoading((prev) => ({ ...prev, [comment.authorId]: false }));
      }

      if (Object.keys(newAvatars).length > 0) {
        setAvatars((prev) => ({ ...prev, ...newAvatars }));
      }
    };

    if (comments.length > 0 && Object.keys(authorGenders).length > 0) {
      loadAvatars();
    }
  }, [comments, authorGenders, avatars]);

  const handleDelete = async (commentId: string) => {
    if (!confirm("Удалить комментарий?")) return;
    setDeletingId(commentId);
    try {
      const res = await fetch(`/administrator/cms/api/comments/${commentId}`, {
        method: "DELETE",
      });
      if (res.ok)
        setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error("Ошибка удаления:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleAvatarError = (authorId: string, gender?: string) => {
    setAvatars((prev) => ({
      ...prev,
      [authorId]: getAvatarByGender(gender),
    }));
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFrom(e.target.value);
    setPage(1);
    setActiveFilter("");
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateTo(e.target.value);
    setPage(1);
    setActiveFilter("");
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Управление комментариями
        </h1>
      </div>

      <DateFilter
        dateFrom={dateFrom}
        dateTo={dateTo}
        activeFilter={activeFilter}
        onDateFromChange={handleDateFromChange}
        onDateToChange={handleDateToChange}
        onSetToday={setToday}
        onSetLast3Days={setLast3Days}
        onSetLastWeek={setLastWeek}
        onSetLastMonth={setLastMonth}
        onClearFilters={clearFilters}
        getTodayDate={getTodayDate}
      />

      <CommentsTableHeader />

      <div className="border border-t-0 border-gray-200 rounded-b-lg bg-white p-4">
        <CommentsList
          comments={comments}
          loading={loading}
          avatars={avatars}
          avatarLoading={avatarLoading}
          deletingId={deletingId}
          authorGenders={authorGenders}
          onDelete={handleDelete}
          onAvatarError={handleAvatarError}
        />
      </div>

      {totalPages > 1 && !loading && comments.length > 0 && (
        <CommentsPagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
