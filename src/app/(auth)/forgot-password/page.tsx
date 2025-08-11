"use client";

import { useState } from "react";
import { InputMask } from "@react-input/mask";
import Tooltip from "../(reg)/_components/Tooltip";
import MiniLoader from "@/components/MiniLoader";
import { buttonStyles, formStyles } from "../styles";
import { authClient } from "../../../../lib/auth-clients";
import { useRouter } from "next/navigation";
import { AuthFormLayout } from "../_components/AuthFormLayout";

const ForgotPassword = () => {
  const [login, setLogin] = useState("");
  const [loginType, setLoginType] = useState<"email" | "phone">("email");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin(e.target.value);
    setError(null);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin(e.target.value);
    setError(null);
  };

  const switchToEmail = () => {
    setLogin("");
    setLoginType("email");
    setError(null);
  };

  const switchToPhone = () => {
    setLogin("");
    setLoginType("phone");
    setError(null);
  };

  const handleToAuth = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    router.replace(path);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

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

      if (!verified) {
        setError(
          loginType === "email"
            ? "Email не подтвержден. Проверьте Вашу почту или зайдите по телефону"
            : "Телефон не подтвержден. Зайдите по email"
        );
        return;
      }

      const { error } = await authClient.requestPasswordReset({
        email: login,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw new Error(error.message);

      setSuccess(true);
    } catch {
      setError("Ошибка при проверке данных");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <MiniLoader />;

  if (success) {
    return (
      <AuthFormLayout>
        <h1 className="text-2xl font-bold text-[#414141] text-center mb-8">
          Проверьте вашу почту
        </h1>
        <p className="px-5 mb-8">
          Мы отправили письмо на адрес <strong>{login}</strong> с инструкциями
          по сбросу пароля.
        </p>
        <p className="px-5 mb-8">
          Если Вы не получили письмо, проверьте папку &quot;Спам&quot; или
          <button
            onClick={handleSubmit}
            className="text-(--color-primary) hover:text-[#ff6633] ml-1 cursor-pointer"
          >
            попробуйте отправить снова
          </button>
        </p>
      </AuthFormLayout>
    );
  }

  return (
    <AuthFormLayout>
      <h1 className="text-2xl font-bold text-[#414141] text-center mb-8">
        Восстановление пароля
      </h1>
      <p className="px-5 mb-8">
        Введите email или номер телефона, связанный с Вашей учетной записью, и
        мы вышлем Вам на email инструкции по сбросу пароля либо код
        подтверждения в виде SMS.
      </p>
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
            {error && <Tooltip text={error} />}
          </div>
        </div>

        <button
          type="submit"
          disabled={!login.trim() || isLoading}
          className={`
              ${buttonStyles.base}
              ${
                !login.trim() || isLoading
                  ? "cursor-not-allowed hover:bg-[#fcd5ba] hover:text-[#ff6633]"
                  : "hover:bg-[#ff6633] hover:text-white hover:shadow-(--shadow-article)"
              }
              active:shadow-(--shadow-button-active)
             duration-300
              mt-4
            `}
        >
          {isLoading ? "Отправка..." : "Отправить"}
        </button>

        <div className="flex flex-row flex-wrap mb-10 mx-auto text-xs mt-6 gap-4 justify-center">
          <button
            className={formStyles.loginLink}
            onClick={handleToAuth("/login")}
          >
            Вход
          </button>

          <button
            className={formStyles.loginLink}
            onClick={handleToAuth("/register")}
          >
            Регистрация
          </button>
        </div>
      </form>
    </AuthFormLayout>
  );
};

export default ForgotPassword;