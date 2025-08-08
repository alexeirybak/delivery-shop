"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { InputMask } from "@react-input/mask";
import Tooltip from "../../(reg)/Tooltip";
import { buttonStyles, formStyles } from "../../styles";
import MiniLoader from "@/components/MiniLoader";

const LoginPage = () => {
  const [login, setLogin] = useState("");
  const [loginType, setLoginType] = useState<"email" | "phone">("email");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    router.replace("/");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLogin(value);
    setError(null);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLogin(value);
    setError(null);
  };

  // Очищаем поле при переключении типа ввода
  const switchToEmail = () => {
    setLogin("");
    setLoginType("email");
  };

  const switchToPhone = () => {
    setLogin("");
    setLoginType("phone");
  };

  const validateInput = () => {
    if (loginType === "email") {
      if (!login.includes("@") || !login.includes(".")) {
        setError("Пожалуйста, введите корректный email");
        return false;
      }
    } else {
      const digitsOnly = login.replace(/\D/g, "");
      if (digitsOnly.length < 11) {
        setError("Номер телефона должен содержать 11 цифр");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInput()) return;

    setIsLoading(true);

    try {
      const normalizedLogin =
        loginType === "phone" ? login.replace(/\D/g, "") : login;

      const response = await fetch("/api/auth/check-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: normalizedLogin, loginType }),
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

      if (!verified) {
        setError(
          loginType === "email"
            ? "Email не подтвержден. Проверьте Вашу почту или зайдите по телефону"
            : "Телефон не подтвержден. Зайдите по email"
        );
        return;
      }

      router.push(
        `/password?login=${encodeURIComponent(normalizedLogin)}&loginType=${loginType}`
      );
    } catch {
      setError("Ошибка при проверке данных");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <MiniLoader />;

  return (
    <div className="absolute inset-0 z-100 flex items-center justify-center bg-[#fcd5bacc] min-h-screen text-[#414141]">
      <div className="bg-white rounded shadow-(--shadow-auth-form) w-full max-w-105 max-h-[100vh] overflow-y-auto">
        <div className="flex justify-end">
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
        <h1 className="text-2xl font-bold text-[#414141] text-center mb-8">
          Вход
        </h1>
        <form
          onSubmit={handleSubmit}
          className="w-65 mx-auto max-h-100vh flex flex-col justify-center overflow-y-auto"
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
                  onChange={handleChange}
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
              {error && <Tooltip text={error} />}
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
                (loginType === "phone" &&
                  login.replace(/\D/g, "").length < 10) ||
                isLoading
                  ? "cursor-not-allowed hover:bg-[#fcd5ba] hover:text-[#ff6633]"
                  : "hover:bg-[#ff6633] hover:text-white hover:shadow-(--shadow-article)"
              }
              active:shadow-(--shadow-button-active)
              transition-colors duration-200
              mt-4
            `}
          >
            Продолжить
          </button>

          <div className="flex flex-row flex-wrap mb-10 mx-auto text-xs mt-6 gap-4 justify-center">
            <Link
              href="/register"
              className="h-8 text-(--color-primary) hover:text-white active:text-white border-1 border-(--color-primary) bg-white hover:bg-(--color-primary) active:shadow-(--shadow-button-default) w-30 rounded flex items-center justify-center duration-300"
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
      </div>
    </div>
  );
};

export default LoginPage;
