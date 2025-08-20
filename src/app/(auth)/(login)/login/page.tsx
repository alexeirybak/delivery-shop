"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { InputMask } from "@react-input/mask";
import { buttonStyles, formStyles } from "../../styles";
import { AuthFormLayout } from "../../_components/AuthFormLayout";
import { ErrorContent } from "../../(reg)/_components/ErrorContent";
import { LoadingContent } from "../../(reg)/_components/LoadingContent";
import { MailWarning, PhoneOff } from "lucide-react";
import { UnverifiedEmail } from "./_components/UnverifiedEmail";
import { AuthMethodSelector } from "./_components/AuthMethodSelector";

const LoginPage = () => {
  const [login, setLogin] = useState("");
  const [loginType, setLoginType] = useState<"email" | "phone">("email");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showUnverifiedEmail, setShowUnverifiedEmail] = useState(false);
  const [showAuthMethodChoice, setShowAuthMethodChoice] = useState(false);

  const router = useRouter();

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLogin(value);
    setError(null);
  };

  const handleForgotPassword = () => {
    if (loginType === "phone") {
      router.replace(
        `/phone-pass-reset?phone=${encodeURIComponent(login)}`
      );
    } else {
      router.replace("/forgot-password");
    }
  };

  const switchToEmail = () => {
    setLogin("");
    setLoginType("email");
  };

  const switchToPhone = () => {
    setLogin("");
    setLoginType("phone");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

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
        setShowUnverifiedEmail(true);
        return;
      }

      if (!verified && loginType === "phone") {
        setError("Телефон не подтвержден. Зайдите по email");
        return;
      }

      // Для телефона показываем выбор метода входа
      if (loginType === "phone") {
        setShowAuthMethodChoice(true);
      } else {
        // Для email сразу переходим к вводу пароля
        router.push(
          `/password-enter?login=${encodeURIComponent(login)}&loginType=${loginType}`
        );
      }
    } catch {
      setError("Ошибка при проверке данных");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthMethodSelect = (method: "password" | "otp") => {
    const cleanLogin = loginType === "phone" ? login.replace(/\D/g, "") : login;

    router.push(
      method === "password"
        ? `/password-enter?login=${encodeURIComponent(cleanLogin)}&loginType=phone`
        : `/otp-enter?login=${encodeURIComponent(cleanLogin)}&loginType=phone`
    );
  };

  const handleBackFromMethodChoice = () => {
    setShowAuthMethodChoice(false);
    setLogin(""); // Очищаем поле ввода
    setLoginType("phone"); // Возвращаем к выбору телефона
  };

  const handleToRegister = () => router.replace("/register");

  if (showUnverifiedEmail) {
    return (
      <UnverifiedEmail
        login={login}
        setLoginAction={setLogin}
        setShowUnverifiedEmailAction={setShowUnverifiedEmail}
      />
    );
  }

  if (showAuthMethodChoice) {
    return (
      <AuthMethodSelector
        phoneNumber={login}
        onMethodSelectAction={handleAuthMethodSelect}
        onBackAction={handleBackFromMethodChoice}
      />
    );
  }

  if (isLoading)
    return (
      <AuthFormLayout>
        <LoadingContent
          title={
            <span style={{ whiteSpace: "pre-line" }}>
              {`Проверка ${loginType === "email" ? "email" : "телефона"}\n${login}`}
            </span>
          }
        />
      </AuthFormLayout>
    );

  if (error)
    return (
      <AuthFormLayout>
        <ErrorContent
          title="Упс!"
          error={error}
          icon={
            loginType === "email" ? (
              <MailWarning className="h-8 w-8 text-red-600" />
            ) : (
              <PhoneOff className="h-8 w-8 text-red-600" />
            )
          }
          secondaryAction={{
            label: "Регистрация",
            onClick: handleToRegister,
          }}
        />
      </AuthFormLayout>
    );

  return (
    <AuthFormLayout>
      <h1 className="text-2xl font-bold text-[#414141] text-center mb-8">
        Вход
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-65 mx-auto max-h-screen flex flex-col justify-center overflow-y-auto gap-y-8"
        autoComplete="off"
      >
        <div className="w-full flex flex-row flex-wrap justify-center gap-x-8 gap-y-4 relative">
          <div className="flex flex-col gap-y-4 items-start w-full">
            <div>
              <label htmlFor="login" className={formStyles.label}>
                {loginType === "email" ? "E-mail" : "Телефон"}
              </label>

              {loginType === "phone" ? (
                <InputMask
                  mask="+7 (___) ___-__-__"
                  replacement={{ _: /\d/ }}
                  value={login}
                  onChange={handleLoginChange}
                  placeholder="+7 (___) ___-__-__"
                  className={formStyles.input}
                  required
                />
              ) : (
                <input
                  type="email"
                  value={login}
                  onChange={handleLoginChange}
                  className={formStyles.input}
                  placeholder="example@mail.com"
                  required
                />
              )}
            </div>

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
          </div>
        </div>

        <button
          type="submit"
          disabled={
            (loginType === "email" &&
              (!login.includes("@") || !login.includes("."))) ||
            (loginType === "phone" && login.replace(/\D/g, "").length < 11) ||
            isLoading
          }
          className={`
            ${buttonStyles.base} [&&]:my-0
           ${
             (loginType === "email" &&
               (!login.includes("@") || !login.includes("."))) ||
             (loginType === "phone" && login.replace(/\D/g, "").length < 11) ||
             isLoading
               ? "cursor-not-allowed bg-[#fcd5ba] text-[#ff6633]"
               : "bg-[#ff6633] text-white hover:shadow-(--shadow-article)"
           }
            active:shadow-(--shadow-button-active)
           duration-300
            
          `}
        >
          Вход
        </button>
        <div className="flex flex-row flex-wrap mx-auto text-xs gap-4 justify-center">
          <Link
            href="/register"
            className={`${formStyles.loginLink} w-auto px-2`}
          >
            Регистрация
          </Link>
          <button
            onClick={handleForgotPassword}
            className="h-8 text-[#414141] hover:text-black w-30 flex items-center justify-center duration-300 cursor-pointer"
          >
            Забыли пароль?
          </button>
        </div>
      </form>
    </AuthFormLayout>
  );
};

export default LoginPage;
