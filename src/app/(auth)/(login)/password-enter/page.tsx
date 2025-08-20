"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import PasswordInput from "../../_components/PasswordInput";
import Image from "next/image";
import Tooltip from "../../_components/Tooltip";
import { buttonStyles } from "../../styles";
import { useAuthStore } from "@/store/authStore";
import { AuthFormLayout } from "../../_components/AuthFormLayout";
import { LoadingContent } from "../../(reg)/_components/LoadingContent";

const EnterPasswordPage = () => {
  return (
    <Suspense
      fallback={
        <AuthFormLayout>
          <LoadingContent title={"Сейчас запросим пароль"} />
        </AuthFormLayout>
      }
    >
      <LoginPasswordContent />
    </Suspense>
  );
};

const LoginPasswordContent = () => {
  const searchParams = useSearchParams();
  const loginParam = searchParams.get("login") || "";
  const loginType = searchParams.get("loginType") || "";
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(null);
  };

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message.includes("Неверный пароль") ||
        error.message.includes("Invalid email or password")
        ? "Неверный пароль"
        : error.message;
    }
    return "Произошла непредвиденная ошибка";
  };

  const handleForgotPassword = () => {
    if (loginType === "phone") {
      router.replace(
        `/phone-pass-reset`
      );
    } else {
      router.replace("/forgot-password");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (loginType === "phone") {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: loginParam, // Используем правильное имя поля
            password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Ошибка при входе");
        }

        const userName = data.user?.name;
        login(userName);
        router.replace("/");
      } else {
        // Логин по email
        await authClient.signIn.email(
          { email: loginParam, password },
          {
            onSuccess: (ctx) => {
              const userName = ctx.data?.user.name || "Пользователь";
              login(userName);
              router.replace("/");
            },
            onError: (ctx) => {
              setError(ctx.error?.message || "Ошибка при входе");
            },
          }
        );
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading)
    return (
      <AuthFormLayout>
        <LoadingContent title={"Происходит авторизация"} />
      </AuthFormLayout>
    );

  return (
    <AuthFormLayout>
      <h1 className="text-2xl font-bold text-center mb-8">Вход</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full mx-auto flex flex-col gap-y-8 justify-center"
        autoComplete="off"
      >
        <div className="w-full flex flex-row flex-wrap justify-center gap-x-8 gap-y-4 relative">
          <div className="flex flex-col items-start relative">
            <PasswordInput
              id="password"
              label="Пароль"
              value={password}
              onChangeAction={handleChange}
              showPassword={showPassword}
              togglePasswordVisibilityAction={() =>
                setShowPassword(!showPassword)
              }
              inputClass="h-15"
            />
            {error && <Tooltip text={error} position="top" />}
          </div>
        </div>

        <button
          type="submit"
          disabled={!password || isLoading}
          className={`
            ${buttonStyles.base} [&&]:my-0 
            ${!password || isLoading ? buttonStyles.inactive : buttonStyles.active}
            my-8`}
        >
          Подтвердить
        </button>

        <div className="flex flex-row flex-wrap mx-auto text-xs">
          <button
            onClick={() => router.replace("/login")}
            className="h-8 text-[#414141] hover:text-black w-30 flex items-center justify-center gap-x-2 duration-300 cursor-pointer"
          >
            <Image
              src="/icons-auth/icon-arrow-left.svg"
              width={24}
              height={24}
              alt="Вернуться"
            />
            Вернуться
          </button>
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

export default EnterPasswordPage;
