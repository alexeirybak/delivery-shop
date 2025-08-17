"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import PasswordInput from "../../_components/PasswordInput";
import Link from "next/link";
import Image from "next/image";
import Tooltip from "../../_components/Tooltip";
import { buttonStyles } from "../../styles";
import { useAuthStore } from "@/store/authStore";
import { AuthFormLayout } from "../../_components/AuthFormLayout";
import { LoadingContent } from "../../(reg)/_components/LoadingContent";

const LoginPasswordPage = () => {
  return (
    <Suspense fallback={<AuthFormLayout>
        <LoadingContent title={"Сейчас запросим пароль"} />
      </AuthFormLayout>}>
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
            phone: loginParam,
            password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Ошибка при входе");
        }

        if (!data.success) {
          throw new Error(data.message || "Неверные учетные данные");
        }

        const userName = data.user?.name || data.user?.phone || "Пользователь";
        router.replace("/");
        login(userName);
      } else {
        // Логин по email
        await authClient.signIn.email(
          { email: loginParam, password },
          {
            onSuccess: (ctx) => {
              const userName = ctx.data?.user.name || "Пользователь";
              router.replace("/");
              login(userName);
            },
            onError: (ctx) => {
              throw new Error(
                ctx.error?.message.includes("Invalid email or password")
                  ? "Неверный пароль"
                  : ctx.error?.message || "Ошибка при входе"
              );
            },
          }
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error &&
        (err.message.includes("Неверный пароль") ||
          err.message.includes("Invalid email or password"))
          ? "Неверный пароль"
          : err instanceof Error
            ? err.message
            : "Произошла непредвиденная ошибка";

      setError(errorMessage);
      console.error("Login error:", err);
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
        className="w-full mx-auto flex flex-col gap-y-8 justify-center overflow-y-auto"
        autoComplete="off"
      >
        <div className="w-full flex flex-row flex-wrap justify-center gap-x-8 gap-y-4 relative">
          <div className="flex flex-col gap-y-4 items-start">
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
            {error && <Tooltip text={error} />}
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
            onClick={() => router.back()}
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
          <Link
            href="/forgot-password"
            className="h-8 text-[#414141] hover:text-black w-30 flex items-center justify-center duration-300 cursor-pointer"
          >
            Забыли пароль?
          </Link>
        </div>
      </form>
    </AuthFormLayout>
  );
};

export default LoginPasswordPage;
