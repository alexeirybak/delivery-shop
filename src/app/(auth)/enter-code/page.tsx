"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "../../../../lib/auth-clients";
import { buttonStyles } from "../styles";
import useTimer from "@/hooks/useTimer";

export default function EnterCodePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const { timeLeft, canResend, startTimer } = useTimer(60);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 4) return;

    try {
      // Добавляем логирование перед проверкой
      console.log(`Проверяем код: ${code} для ${phone}`);

      const { error: verifyError, data } = await authClient.phoneNumber.verify({
        phoneNumber: phone,
        code,
        disableSession: true, // Создаёт сессию после верификации
        updatePhoneNumber: false, // Не пытается обновить номер у существующего пользователя
      });

      if (verifyError) {
        console.error("Ошибка верификации:", verifyError);
        throw verifyError;
      }

      console.log("Успешная верификация. Данные:", data);
      //router.push("/dashboard");
    } catch (err) {
      console.error("Полная ошибка:", err);
      setError("Неверный код. Используйте код из SMS");
    }
  };
  const handleResend = async () => {
    try {
      const { error: sendError } = await authClient.phoneNumber.sendOtp({
        phoneNumber: phone,
      });

      if (sendError) throw sendError;
      startTimer();
    } catch {
      setError("Ошибка при отправке кода");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Введите код из SMS</h1>
      <p className="mb-6">Код отправлен на {phone}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          className="w-full p-3 border rounded"
          autoFocus
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={code.length !== 4}
          className={`${buttonStyles.base} ${
            code.length !== 4 ? buttonStyles.inactive : buttonStyles.active
          }`}
        >
          Подтвердить
        </button>
      </form>

      <div className="mt-4">
        {canResend ? (
          <button onClick={handleResend} className="text-blue-500">
            Отправить код повторно
          </button>
        ) : (
          <p>Повторная отправка через {timeLeft} сек</p>
        )}
      </div>
    </div>
  );
}
