"use client";

import { useState, useEffect } from "react";
import { Send, Loader2, AlertCircle, Shield, Ban } from "lucide-react";
import { CommentFormProps, UserRole } from "../../../types";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { RulesModal } from "./RulesModal";
import { acceptRules, checkRulesAccepted } from "@/actions/acceptRules";

interface BanInfo {
  isBanned: boolean;
  bannedUntil: string | null;
}

export default function CommentForm({
  articleId,
  parentId,
  onSuccess,
  placeholder = "Напишите комментарий",
}: CommentFormProps) {
  const { user } = useAuthStore();
  const [content, setContent] = useState("");
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [banInfo, setBanInfo] = useState<BanInfo>({ isBanned: false, bannedUntil: null });

  const userId = user?.id || user?._id;
  const userName = `${user?.surname} ${user?.name}`;
  const userRole = (user?.role as UserRole) || "user";

  // Проверяем, забанен ли пользователь
  useEffect(() => {
    async function checkBanStatus() {
      if (!userId) return;

      try {
        const response = await fetch(
          `/administrator/cms/api/comments/user/ban/status?userId=${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          setBanInfo({
            isBanned: data.isBanned,
            bannedUntil: data.bannedUntil || null
          });
        }
      } catch (error) {
        console.error("Ошибка проверки статуса бана:", error);
      }
    }

    checkBanStatus();
  }, [userId]);

  // Проверяем, ознакомлен ли пользователь с правилами
  useEffect(() => {
    async function checkRules() {
      if (userId) {
        const accepted = await checkRulesAccepted(userId);
        setRulesAccepted(accepted);
      }
      setLoading(false);
    }
    
    checkRules();
  }, [userId]);

  const formatBanDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAcceptRules = async () => {
    if (!userId) return;
    
    const result = await acceptRules(userId);
    if (result.success) {
      setRulesAccepted(true);
      setShowRulesModal(false);
    } else {
      setError("Не удалось сохранить статус. Попробуйте еще раз.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !userName) {
      setError("Войдите в систему, чтобы оставить комментарий");
      return;
    }

    // Проверяем, забанен ли пользователь
    if (banInfo.isBanned) {
      if (banInfo.bannedUntil) {
        setError(`Вы заблокированы до ${formatBanDate(banInfo.bannedUntil)}`);
      } else {
        setError("Вы заблокированы навсегда");
      }
      return;
    }

    if (!content.trim()) {
      setError("Введите текст комментария");
      return;
    }

    // Проверяем, ознакомлен ли пользователь с правилами
    if (!rulesAccepted) {
      setShowRulesModal(true);
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

  if (loading) {
    return (
      <div className="text-center py-4 text-gray-600">
        Загрузка...
      </div>
    );
  }

  // Если пользователь забанен, показываем специальное сообщение
  if (banInfo.isBanned) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <Ban className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-red-700 mb-2">
          Вы заблокированы
        </h3>
        <p className="text-red-600">
          {banInfo.bannedUntil 
            ? `До ${formatBanDate(banInfo.bannedUntil)}` 
            : "Навсегда"}
        </p>
        <p className="text-sm text-gray-600 mt-4">
          По всем вопросам обращайтесь к администрации
        </p>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
        
        {!rulesAccepted && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800">
            <p className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Чтобы оставлять комментарии, необходимо ознакомиться с{" "}
              <button
                type="button"
                onClick={() => setShowRulesModal(true)}
                className="text-green-600 hover:text-green-800 underline font-medium cursor-pointer"
              >
                правилами сообщества
              </button>
            </p>
          </div>
        )}

        {rulesAccepted && (
          <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-800">
            <p className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Вы приняли правила сообщества. Спасибо!
            </p>
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
            disabled={submitting || !content.trim() || !rulesAccepted}
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

      <RulesModal 
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
        onAccept={handleAcceptRules}
      />
    </>
  );
}