"use client";

import { useState } from "react";
import { authClient } from "../../../../lib/auth-clients"; // Ваш клиент для работы с аутентификацией
import { useRouter } from "next/navigation";
import Image from "next/image";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    router.replace("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw new Error(error.message);
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Проверьте вашу почту</h1>
        <p>
          Мы отправили письмо на адрес <strong>{email}</strong> с инструкциями
          по сбросу пароля.
        </p>
        <p className="mt-4">
          Если вы не получили письмо, проверьте папку &quot;Спам&quot; или
          <button
            onClick={handleSubmit}
            className="text-blue-600 hover:text-blue-800 ml-1"
          >
            попробуйте отправить снова
          </button>
          .
        </p>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-center mb-8">
          Восстановление пароля
        </h1>
        <p className="px-5">
          Введите email, связанный с вашей учетной записью, и мы вышлем вам
          инструкции по сбросу пароля.
        </p>

        {error && (
          <div className="mb-8 p-5 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="w-65 mx-auto max-h-100vh flex flex-col justify-center overflow-y-auto"
          autoComplete="off"
        >
          <div className="w-full flex flex-row flex-wrap justify-center gap-x-8 gap-y-4 relative">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded text-white ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Отправка..." : "Отправить инструкции"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
