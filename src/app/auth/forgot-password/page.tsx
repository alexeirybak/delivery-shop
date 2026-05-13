"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Loader2, Mail, KeyRound, ArrowLeft } from "lucide-react";
import Link from "next/link";
import SuccessSentEmail from "../_components/SuccessSentEmail";
import "./forgot-password.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/auth/reset-password`,
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
    return <SuccessSentEmail email={email} />;
  }

  return (
    <main className="forgot-page">
      <div className="forgot-glow" />
      <div className="forgot-container">
        <div className="forgot-content">
          <div className="forgot-header">
            <div className="forgot-icon">
              <KeyRound className="w-8 h-8" />
            </div>
            <h1 className="forgot-title">Восстановление / сброс пароля</h1>
          </div>

          <p className="forgot-description">
            Введите email, по которому проходила регистрация, и мы вышлем Вам
            инструкции по сбросу пароля.
          </p>

          {error && <div className="forgot-error">{error}</div>}

          <form onSubmit={handleSubmit} className="forgot-form">
            <div className="forgot-group">
              <label htmlFor="email">
                <Mail className="w-4 h-4" />
                <span>E-mail</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="alex@neurodidactica.ru"
                className="forgot-input"
                autoComplete="email"
              />
            </div>

            <button type="submit" disabled={loading} className="forgot-button">
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  Отправка...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Отправить инструкции
                </>
              )}
            </button>
          </form>

          <div className="forgot-back">
            <Link href="/auth/login" className="forgot-back-link">
              <ArrowLeft className="w-4 h-4" />
              Вернуться к авторизации
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
