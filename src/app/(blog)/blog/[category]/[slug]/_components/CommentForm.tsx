"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { CommentFormProps, UserRole } from "../../../types";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

export default function CommentForm({
  articleId,
  parentId,
  onSuccess,
  placeholder="Напишите комментарий"
}: CommentFormProps) {
  const { user } = useAuthStore();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const userId = user?.id || user?._id;
  const userName = `${user?.surname} ${user?.name}`;
  const userRole = (user?.role as UserRole) || "user";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !userName) {
      setError("Войдите в систему, чтобы оставить комментарий");
      return;
    }

    if (!content.trim()) {
      setError("Введите текст комментария");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          articleId,
          parentId,
          content: content.trim(),
          authorId: userId,
          authorName: userName,
          authorRole: userRole,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Ошибка отправки");
      }

      const newComment = await response.json();
      onSuccess(newComment);
      setContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка отправки");
    } finally {
      setSubmitting(false);
    }
  };

  if (!userId) {
    return (
      <div className="text-center py-4 text-gray-600">
        <Link
          href="/login"
          className="text-green-600 hover:text-green-800 font-medium"
        >
          Войдите
        </Link>{" "}
        в систему, чтобы оставлять комментарии
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all resize-none"
        rows={3}
        maxLength={2000}
        disabled={submitting}
      />

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {content.length}/2000 символов
        </div>
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer duration-300"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Отправка...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Отправить
            </>
          )}
        </button>
      </div>
    </form>
  );
}
