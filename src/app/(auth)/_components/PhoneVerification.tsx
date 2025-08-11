"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../../../../lib/auth-clients";
import useTimer from "@/hooks/useTimer";

export default function PhoneVerification({ phoneNumber }: { phoneNumber: string }) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const router = useRouter();
  const { timeLeft, canResend, startTimer } = useTimer(60);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const { error: verifyError } = await authClient.phoneNumber.verify({
        phoneNumber,
        code,
        updatePhoneNumber: true,
      });

      if (verifyError) throw new Error(verifyError.message);
      
      router.replace("/");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Ошибка верификации");
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setStatus("loading");

    try {
      const { error: sendError } = await authClient.phoneNumber.sendOtp({
        phoneNumber,
      });

      if (sendError) throw new Error(sendError.message);
      
      startTimer();
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Ошибка отправки SMS");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          inputMode="numeric"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          maxLength={4}
          disabled={status === "loading"}
        />
        
        <button 
          type="submit" 
          disabled={status === "loading" || code.length !== 4}
        >
          {status === "loading" ? "Проверка..." : "Подтвердить"}
        </button>
      </form>

      {/* Блок повторной отправки */}
      {!canResend ? (
        <p>Повторная отправка через {timeLeft} сек.</p>
      ) : (
        <button 
          onClick={handleResend}
          className="text-orange-500 underline"
        >
          Отправить код повторно
        </button>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
