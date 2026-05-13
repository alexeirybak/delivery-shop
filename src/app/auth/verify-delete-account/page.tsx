"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Loader2, Trash2, Mail, AlertTriangle } from "lucide-react";
import "./styles/verify-delete-account.css";

const VerifyDeleteAccount = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await authClient.deleteUser({
        callbackURL: "/auth/goodbye",
      });

      if (error) {
        throw new Error(error.message);
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="verify-delete-success">
        <div className="verify-delete-success-icon">
          <Mail size={48} />
        </div>
        <h1 className="verify-delete-success-title">Проверьте Вашу почту</h1>
        <p className="verify-delete-success-text">
          Мы отправили письмо с подтверждением удаления аккаунта. 
          Перейдите по ссылке в письме, чтобы завершить процесс.
        </p>
      </div>
    );
  }

  return (
    <div className="verify-delete-container">
      <div className="verify-delete-header">
        <div className="verify-delete-header-icon">
          <Trash2 size={48} />
        </div>
        <h1 className="verify-delete-title">Удаление аккаунта</h1>
      </div>

      <div className="verify-delete-warning">
        <AlertTriangle size={20} className="verify-delete-warning-icon" />
        <div className="verify-delete-warning-content">
          <p className="verify-delete-warning-title">
            Это действие необратимо
          </p>
          <ul className="verify-delete-warning-list">
            <li>Все ваши данные будут безвозвратно удалены</li>
            <li>Созданные учебные материалы и шаблоны будут потеряны</li>
            <li>История генерации контента и достижения исчезнут</li>
            <li>Доступ к платформе и созданным курсам будет закрыт</li>
            <li className="verify-delete-warning-highlight">
              Оплаченные подписки и средства НЕ ВОЗВРАЩАЮТСЯ
            </li>
          </ul>
        </div>
      </div>

      <p className="verify-delete-description">
        Для подтверждения удаления аккаунта мы отправим письмо с инструкциями 
        на адрес электронной почты, указанный при регистрации. 
        Все ваши учебные материалы, сгенерированный контент и личные данные 
        будут удалены без возможности восстановления.
      </p>

      {error && <div className="verify-delete-error">{error}</div>}

      <form onSubmit={handleSubmit} className="verify-delete-form">
        <button
          type="submit"
          disabled={loading}
          className="verify-delete-btn"
        >
          {loading ? (
            <>
              <Loader2 className="verify-delete-btn-icon spin" />
              Отправка...
            </>
          ) : (
            <>
              <Mail className="verify-delete-btn-icon" />
              Отправить подтверждение
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default VerifyDeleteAccount;