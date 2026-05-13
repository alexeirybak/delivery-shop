"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { MailWarning } from "lucide-react";
import { PasswordInput } from "../_components/PasswordInput";
import { ErrorContent } from "../register/_components/ErrorContent";
import SuccessUpdatePass from "../_components/SuccessUpdatePass";
import "./styles/reset-password.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const queryToken = new URLSearchParams(window.location.search).get("token");
    if (!queryToken) {
      setErrors({ general: "Недействительная ссылка для сброса пароля" });
      return;
    }
    setToken(queryToken);
  }, []);

  const validatePassword = (pass: string) => {
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumbers = /\d/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    const isLongEnough = pass.length >= 8;

    return (
      isLongEnough &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!password) {
      newErrors.password = "Пароль обязателен";
    } else if (!validatePassword(password)) {
      newErrors.password =
        "Пароль должен содержать: 8+ символов, заглавные и строчные буквы, цифры и спецсимволы";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Подтвердите пароль";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (isSubmitted) {
      setErrors((prev) => ({
        ...prev,
        password: !e.target.value
          ? "Пароль обязателен"
          : !validatePassword(e.target.value)
            ? "Пароль должен содержать: 8+ символов, заглавные и строчные буквы, цифры и спецсимволы"
            : undefined,
      }));
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(e.target.value);
    if (isSubmitted) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: !e.target.value
          ? "Подтвердите пароль"
          : e.target.value !== password
            ? "Пароли не совпадают"
            : undefined,
      }));
    }
  };

  const handleToStart = () => {
    router.replace("/forgot-password");
  };

  if (errors.general && !token) {
    return (
      <main className="reset-page">
        <div className="reset-glow" />
        <div className="reset-container">
          <ErrorContent
            title="Что-то пошло не так!"
            error={errors.general}
            icon={<MailWarning className="h-8 w-8 text-red-600" />}
            secondaryAction={{
              label: "Запросить новую ссылку для сброса пароля",
              onClick: handleToStart,
            }}
          />
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (!token) {
        throw new Error("Токен сброса пароля отсутствует");
      }

      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (error) {
        throw new Error(error.message);
      }

      setSuccess(true);

      setTimeout(() => {
        router.replace("/auth/login");
      }, 3000);
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : "Произошла ошибка",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <SuccessUpdatePass />;
  }

  return (
    <main className="reset-page">
      <div className="reset-glow" />
      <div className="reset-container">
        <div className="reset-content">
          <h1 className="reset-title">Установите новый пароль</h1>

          {errors.general && (
            <div className="reset-error">{errors.general}</div>
          )}

          <form onSubmit={handleSubmit} className="reset-form">
            <PasswordInput
              id="password"
              label="Новый пароль"
              value={password}
              onChange={handlePasswordChange}
              error={errors.password}
              isSubmitted={isSubmitted}
              autoComplete="new-password"
              showStrength={true}
            />

            <PasswordInput
              id="confirmPassword"
              label="Подтвердите пароль"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={errors.confirmPassword}
              isSubmitted={isSubmitted}
              autoComplete="new-password"
              compareWith={password}
              tooltipMessage="Пароли пока не совпадают"
            />

            <button type="submit" disabled={loading} className="reset-button">
              {loading ? "Сохранение..." : "Сохранить новый пароль"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ResetPassword;
