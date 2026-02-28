"use client";

import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import useTimer from "@/hooks/useTimer";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthFormLayout } from "@/app/(auth)/_components/AuthFormLayout";
import { LoadingContent } from "@/app/(auth)/(reg)/_components/LoadingContent";
import OTPResendCode from "@/app/(auth)/_components/OTPResendButton";
import { CONFIG } from "../../../../../../config/config";
import { buttonStyles } from "@/app/styles";

const LoginWithOTP = ({ phoneNumber }: { phoneNumber: string }) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(CONFIG.MAX_ATTEMPTS);
  const { timeLeft, canResend, startTimer } = useTimer(CONFIG.TIMEOUT_PERIOD);
  const router = useRouter();
  const { login } = useAuthStore();

  useEffect(() => {
    startTimer();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 4) return;

    setIsLoading(true);

    try {
      const { error: verifyError } = await authClient.phoneNumber.verify({
        phoneNumber,
        code,
        disableSession: false,
      });

      if (verifyError) throw verifyError;

      setAttemptsLeft(CONFIG.MAX_ATTEMPTS);

      const response = await fetch("/api/auth/check-phone", {
        method: "POST",
        body: JSON.stringify({
          phoneNumber,
        }),
      });

      if (!response.ok) {
        throw new Error("Данные не получены");
      }

      await response.json();

      login();

      router.replace("/");
    } catch (error) {
      console.error("Ошибка верификации телефона:", error);
      setCode("");
      setAttemptsLeft((prev) => prev - 1);

      if (attemptsLeft <= 1) {
        setError("Попытки исчерпаны. Пожалуйста, зарегистрируйтесь снова");
        setTimeout(() => router.replace("/register"), 2000);
      } else {
        setError(`Неверный код. Осталось попыток: ${attemptsLeft - 1}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      await authClient.phoneNumber.sendOtp(
        { phoneNumber },
        {
          onSuccess: () => {
            startTimer();
            setError("");
            setAttemptsLeft(CONFIG.MAX_ATTEMPTS);
          },
          onError: (ctx) => {
            setError(ctx.error?.message || "Ошибка при отправке SMS");
          },
        },
      );
    } catch (error) {
      console.error("Ошибка отправки кода:", error);
      setError("Ошибка при отправке кода");
    }
  };

  if (isLoading) {
    return (
      <AuthFormLayout>
        <LoadingContent title={"Проверяем код..."} />
      </AuthFormLayout>
    );
  }

  return (
    <AuthFormLayout>
      <div className="flex flex-col gap-y-8">
        <h1 className="text-2xl font-bold text-center text-main-text">Вход</h1>
        <div>
          <p className="text-center text-[#8f8f8f]">Код из SMS</p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center max-h-screen mx-auto w-65"
            autoComplete="off"
          >
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]{4}"
              maxLength={4}
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError("");
              }}
              className="flex justify-center w-27.5 h-15 text-center text-2xl px-4 py-3 border border-[#bfbfbf] rounded focus:border-primary focus:shadow-button-default focus:bg-white focus:outline-none"
              autoComplete="one-time-code"
              required
            />
            {error && (
              <div className="mt-2 text-sm text-center text-red-500">
                {error}
              </div>
            )}
            <button
              type="submit"
              className={`${buttonStyles.base} ${code.length !== 4 ? buttonStyles.inactive : buttonStyles.active} [&&]:mt-8 mb-0`}
              disabled={code.length !== 4 || attemptsLeft <= 0}
            >
              Подтвердить
            </button>
          </form>
        </div>

        <OTPResendCode
          canResend={canResend}
          timeLeft={timeLeft}
          onResendAction={handleResend}
        />
        <Link
          href="/register"
          className="flex items-center justify-center h-8 mx-auto text-xs cursor-pointer text-main-text hover:text-black w-30 gap-x-2 transition-custom"
        >
          <Image
            src="/icons-auth/icon-arrow-left.svg"
            width={24}
            height={24}
            alt="Вернуться"
          />
          Вернуться
        </Link>
      </div>
    </AuthFormLayout>
  );
};

export default LoginWithOTP;
