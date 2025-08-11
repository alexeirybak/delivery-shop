"use client";

import { useState, useEffect } from "react";
import { authClient } from "../../../../lib/auth-clients";
import { useRouter } from "next/navigation";
import PasswordInput from "../_components/PasswordInput";
import CloseButton from "../_components/CloseButton";

const ResetPassword = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const queryToken = new URLSearchParams(window.location.search).get("token");
    if (!queryToken) {
      setError("Недействительная ссылка для сброса пароля");
    }
    setToken(queryToken);
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "newPassword") {
      setNewPassword(value);
    } else if (id === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
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
        newPassword,
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

  if (error && !token) {
    return (
      <div className="absolute inset-0 z-100 flex items-center justify-center bg-[#fcd5bacc] min-h-screen text-[#414141]">
        <div className="bg-white rounded shadow-(--shadow-auth-form) w-full max-w-105 max-h-[100vh] overflow-y-auto p-6">
          <CloseButton />
          <h1 className="text-2xl font-bold mb-4 text-red-600">Ошибка</h1>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => router.push("/forgot-password")}
            className="text-blue-600 hover:text-blue-800"
          >
            Запросить новую ссылку для сброса пароля
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="absolute inset-0 z-100 flex items-center justify-center bg-[#fcd5bacc] min-h-screen text-[#414141]">
        <div className="bg-white rounded shadow-(--shadow-auth-form) w-full max-w-105 max-h-[100vh] overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-4 text-(--color-primary)">
            Пароль успешно изменен!
          </h1>
          <p>Вы будете перенаправлены на страницу входа...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-100 flex items-center justify-center bg-[#fcd5bacc] min-h-screen text-[#414141]">
      <div className="bg-white rounded shadow-(--shadow-auth-form) w-full max-w-105 max-h-[100vh] overflow-y-auto">
        <CloseButton />
        <div className="px-6 pb-6">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Установите новый пароль
          </h1>

          {error && (
            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordInput
              id="newPassword"
              label="Новый пароль"
              value={newPassword}
              onChangeAction={handlePasswordChange}
              showPassword={showPassword}
              togglePasswordVisibilityAction={() =>
                setShowPassword(!showPassword)
              }
              showRequirements={true}
              inputClass="w-full"
            />

            <PasswordInput
              id="confirmPassword"
              label="Подтвердите пароль"
              value={confirmPassword}
              onChangeAction={handlePasswordChange}
              showPassword={showConfirmPassword}
              togglePasswordVisibilityAction={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              compareWith={newPassword}
              inputClass="w-full"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-8 h-15 text-(--color-primary) hover:text-white active:text-white border-1 border-(--color-primary) bg-white hover:bg-(--color-primary) active:shadow-(--shadow-button-default) w-full rounded flex items-center justify-center duration-300 cursor-pointer"
            >
              {loading ? "Сохранение..." : "Сохранить новый пароль"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
