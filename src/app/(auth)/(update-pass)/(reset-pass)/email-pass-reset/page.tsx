"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import PasswordInput from "../../../_components/PasswordInput";
import { AuthFormLayout } from "../../../_components/AuthFormLayout";
import Tooltip from "../../../_components/Tooltip";
import { ErrorContent } from "../../../(reg)/_components/ErrorContent";
import { MailWarning } from "lucide-react";
import { isPasswordValid } from "../../../../../../utils/validation/passValid";
import SuccessUpdatePass from "../../_components/SuccessUpdatePass";

const ResetPassword = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const queryToken = new URLSearchParams(window.location.search).get("token");
    if (!queryToken) {
      setError("Недействительная ссылка для сброса пароля");
    }
    setToken(queryToken);
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(null);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Проверка валидности пароля
    if (!isPasswordValid(password)) {
      setError(
        "Пароль должен содержать: 6+ символов, заглавные и строчные буквы, цифры"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    setLoading(true);
    setError(null);

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
        router.replace("/login");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  const handleToStart = () => {
    router.replace("/forgot-password");
  };

  if (error && !token) {
    return (
      <ErrorContent
        title="Что-то пошло не так!"
        error={error}
        icon={<MailWarning className="h-8 w-8 text-red-600" />}
        secondaryAction={{
          label: (
            <>
              Запросить новую ссылку
              <br />
              для сброса пароля
            </>
          ),
          onClick: handleToStart,
        }}
      />
    );
  }

  if (success) {
    return <SuccessUpdatePass />;
  }

  return (
    <AuthFormLayout>
      <h1 className="text-2xl font-bold text-center mb-8">
        Установите новый пароль
      </h1>
      {error && <Tooltip text={error} position="top" />}
      <form
        onSubmit={handleSubmit}
        className="w-full mx-auto flex flex-col gap-y-8 justify-center"
        autoComplete="off"
      >
        <div className="w-full flex flex-row flex-wrap justify-center gap-x-8 gap-y-4">
          <div className="flex flex-col gap-y-4 items-start">
            <PasswordInput
              id="password"
              label="Новый пароль"
              value={password}
              onChangeAction={handlePasswordChange}
              showPassword={showPassword}
              togglePasswordVisibilityAction={() =>
                setShowPassword(!showPassword)
              }
              showRequirements={true}
              inputClass={
                password.length > 0 && !isPasswordValid(password)
                  ? "border-red-500"
                  : ""
              }
            />
            <PasswordInput
              id="confirmPassword"
              label="Подтвердите пароль"
              value={confirmPassword}
              onChangeAction={handleConfirmPasswordChange}
              showPassword={showConfirmPassword}
              togglePasswordVisibilityAction={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              compareWith={password}
              inputClass={
                confirmPassword.length > 0 && password !== confirmPassword
                  ? "border-red-500"
                  : ""
              }
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`bg-(--color-primary) hover:shadow-(--shadow-button-default) active:shadow-(--shadow-button-active) py-3 px-6 text-white cursor-pointer duration-300 rounded flex-1 disabled:bg-[#e5ffde]`}
        >
          {loading ? "Сохранение..." : "Сохранить новый пароль"}
        </button>
      </form>
    </AuthFormLayout>
  );
};

export default ResetPassword;
