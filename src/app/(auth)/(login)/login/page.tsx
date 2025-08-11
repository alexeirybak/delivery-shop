"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { InputMask } from "@react-input/mask";
import Tooltip from "../../(reg)/_components/Tooltip";
import { buttonStyles, formStyles } from "../../styles";
import MiniLoader from "@/components/MiniLoader";
import { AuthFormLayout } from "../../_components/AuthFormLayout";
import { authClient } from "../../../../../lib/auth-clients";

const LoginPage = () => {
  const [login, setLogin] = useState("");
  const [loginType, setLoginType] = useState<"email" | "phone">("email");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false); // Новое состояние
  const [resendStatus, setResendStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle"); 
  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLogin(value);
    setError(null);
    setShowResendButton(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLogin(value);
    setError(null);
    setShowResendButton(false);
  };

  const switchToEmail = () => {
    setLogin("");
    setLoginType("email");
    setShowResendButton(false);
  };

  const switchToPhone = () => {
    setLogin("");
    setLoginType("phone");
    setShowResendButton(false);
  };

  // Функция для повторной отправки подтверждения
  const handleResendVerification = async () => {
    setResendStatus("loading");
    try {
      await authClient.sendVerificationEmail({
        email: login,
        callbackURL: "/verify/success",
      });
      setResendStatus("success");
      setShowResendButton(false);
      setError(null);
    } catch {
      setResendStatus("error");
      setError("Ошибка при отправке письма. Попробуйте позже.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setShowResendButton(false);

    try {
      const response = await fetch("/api/auth/check-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, loginType }),
      });

      const { exists, verified } = await response.json();

      if (!exists) {
        setError(
          loginType === "email"
            ? "Аккаунт с таким email не зарегистрирован"
            : "Аккаунт с таким телефоном не зарегистрирован"
        );
        return;
      }

      if (!verified && loginType === "email") {
        setError("Email не подтвержден. Проверьте Вашу почту.");
        setShowResendButton(true); // Показываем кнопку повторной отправки
        return;
      }

      if (!verified && loginType === "phone") {
        setError("Телефон не подтвержден. Зайдите по email");
        return;
      }

      router.push(
        `/password?login=${encodeURIComponent(login)}&loginType=${loginType}`
      );
    } catch {
      setError("Ошибка при проверке данных");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <MiniLoader />;

  return (
    <AuthFormLayout>
      <h1 className="text-2xl font-bold text-[#414141] text-center mb-8">
        Вход
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-65 mx-auto max-h-screen flex flex-col justify-center overflow-y-auto"
        autoComplete="off"
      >
        <div className="w-full flex flex-row flex-wrap justify-center gap-x-8 gap-y-4 relative">
          <div className="flex flex-col gap-y-4 items-start w-full">
            <label htmlFor="login" className={formStyles.label}>
              {loginType === "email" ? "E-mail" : "Телефон"}
            </label>

            {loginType === "phone" ? (
              <InputMask
                mask="+7 (___) ___-__-__"
                replacement={{ _: /\d/ }}
                value={login}
                onChange={handlePhoneChange}
                placeholder="+7 (___) ___-__-__"
                className={formStyles.input}
                required
              />
            ) : (
              <input
                id="email"
                type="email"
                value={login}
                onChange={handleEmailChange}
                className={formStyles.input}
                placeholder="example@mail.com"
                required
              />
            )}

            <div className="flex gap-2 text-sm mx-auto">
              <button
                type="button"
                onClick={switchToEmail}
                className={`px-2 py-1 rounded cursor-pointer ${loginType === "email" ? "bg-[#ff6633] text-white" : "bg-gray-100"}`}
              >
                По email
              </button>
              <button
                type="button"
                onClick={switchToPhone}
                className={`px-2 py-1 rounded cursor-pointer ${loginType === "phone" ? "bg-[#ff6633] text-white" : "bg-gray-100"}`}
              >
                По телефону
              </button>
            </div>

            {error && (
              <div className="flex flex-col items-start w-full">
                <Tooltip text={error} />
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={
            (loginType === "email" && !login.includes("@")) ||
            (loginType === "phone" && login.replace(/\D/g, "").length < 10) ||
            isLoading
          }
          className={`
            ${buttonStyles.base}
            ${
              (loginType === "email" && !login.includes("@")) ||
              (loginType === "phone" && login.replace(/\D/g, "").length < 10) ||
              isLoading
                ? "cursor-not-allowed hover:bg-[#fcd5ba] hover:text-[#ff6633]"
                : "hover:bg-[#ff6633] hover:text-white hover:shadow-(--shadow-article)"
            }
            active:shadow-(--shadow-button-active)
           duration-300
            mt-4
          `}
        >
          Продолжить
        </button>
        {showResendButton && (
          <button
            type="button"
            onClick={handleResendVerification}
            disabled={resendStatus === "loading"}
            className={`${formStyles.loginLink} w-auto px-2`}
          >
            {resendStatus === "loading"
              ? "Отправка..."
              : resendStatus === "success"
                ? "Письмо отправлено!"
                : "Отправить письмо повторно"}
          </button>
        )}
        <div className="flex flex-row flex-wrap mb-10 mx-auto text-xs mt-6 gap-4 justify-center">
          <Link
            href="/register"
            className={`${formStyles.loginLink} w-auto px-2`}
          >
            Регистрация
          </Link>
          <Link
            href="/forgot-password"
            className="h-8 text-[#414141] hover:text-black w-30 flex items-center justify-center duration-300"
          >
            Забыли пароль?
          </Link>
        </div>
      </form>
    </AuthFormLayout>
  );
};

export default LoginPage;
