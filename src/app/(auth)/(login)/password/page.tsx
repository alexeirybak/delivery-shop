"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "../../../../../lib/auth-clients";
import PasswordInput from "../../PasswordInput";
import Link from "next/link";
import Image from "next/image";
import Tooltip from "../../(reg)/Tooltip";
import { buttonStyles } from "../../styles";
import MiniLoader from "@/components/MiniLoader";
import { useAuthStore } from "@/store/authStore";

const LoginPasswordPage = () => {
  return (
    <Suspense fallback={<MiniLoader />}>
      <LoginPasswordContent />
    </Suspense>
  );
};

const LoginPasswordContent = () => {
  const { login } = useAuthStore();
  const searchParams = useSearchParams();
  const loginParam = searchParams.get("login") || "";
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    router.replace("/");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(null);
  };

  const isPhone = (value: string) => {
    // Улучшенная проверка номера телефона
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
      value
    );
  };

  const normalizePhone = (phone: string) => {
    // Удаляем все нецифровые символы
    return phone.replace(/\D/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isPhone(loginParam)) {
        // Логин по номеру телефона
        const normalizedPhone = normalizePhone(loginParam);

        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: normalizedPhone,
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
              let errorMessage = "Ошибка при входе";
              if (ctx.error) {
                if (ctx.error.message.includes("Invalid email or password")) {
                  errorMessage = "Неверный email или пароль";
                } else {
                  errorMessage = ctx.error.message || errorMessage;
                }
              }
              setError(errorMessage);
            },
          }
        );
      }
    } catch (err) {
      let errorMessage = "Произошла непредвиденная ошибка";
      if (err instanceof Error) {
        if (
          err.message.includes("Неверный пароль") ||
          err.message.includes("Invalid email or password")
        ) {
          errorMessage = "Неверный пароль";
        } else if (err.message.includes("Пользователь не найден")) {
          errorMessage = "Пользователь с такими данными не найден";
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <MiniLoader />;

  return (
    <div className="absolute inset-0 z-100 flex items-center justify-center bg-[#fcd5bacc] min-h-screen text-[#414141]">
      <div className="bg-white rounded shadow-(--shadow-auth-form) w-full max-w-105 max-h-[100vh] overflow-y-auto flex flex-col items-center justify-center">
        <div className="flex justify-end w-full">
          <button
            onClick={handleClose}
            className="bg-[#f3f2f1] rounded duration-300 cursor-pointer mb-8"
            aria-label="Закрыть"
          >
            <Image
              src="/icons-products/icon-closer.svg"
              width={24}
              height={24}
              alt="Закрыть"
            />
          </button>
        </div>

        <h1 className="text-2xl font-bold text-center mb-8">Вход</h1>
        <form
          onSubmit={handleSubmit}
          className="w-65 mx-auto max-h-100vh flex flex-col justify-center overflow-y-auto"
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
            ${buttonStyles.base} 
            ${!password || isLoading ? buttonStyles.inactive : buttonStyles.active}
            my-8`}
          >
            Подтвердить
          </button>

          <div className="flex flex-row flex-wrap mb-10 mx-auto text-xs mt-4">
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
      </div>
    </div>
  );
};

export default LoginPasswordPage;
