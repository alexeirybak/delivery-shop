"use client";

import { useState } from "react";
import { Save, X } from "lucide-react";
import { CommentEditFormProps } from "@/app/(blog)/blog/types/comments.types";

export default function CommentEditForm({
  commentId,
  initialContent,
  userId,
  onSuccess,
  onCancel,
}: CommentEditFormProps) {
  const [content, setContent] = useState(initialContent);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Комментарий не может быть пустым");
      return;
    }

    if (content === initialContent) {
      onCancel(); 
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content.trim(),
          userId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Ошибка редактирования");
      }

      const data = await response.json();
      onSuccess(data.content, data.editedAt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка редактирования");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      {error && (
        <div className="mb-2 p-2 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all resize-none text-sm"
        rows={3}
        maxLength={1000}
        disabled={submitting}
        autoFocus
      />

      <div className="flex justify-end items-center gap-2 mt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1 cursor-pointer duration-300"
        >
          <X className="w-4 h-4" />
          Отмена
        </button>
        <button
          type="submit"
          disabled={submitting || !content.trim() || content === initialContent}
          className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer duration-300"
        >
          <Save className="w-4 h-4" />
          {submitting ? "Сохранение..." : "Сохранить"}
        </button>
      </div>
    </form>
  );
}