"use client";
import { useRouter } from "next/navigation";
import { buttonStyles } from "@/app/(auth)/styles";
import { authClient } from "@/lib/auth-client";
import useTimer from "@/hooks/useTimer";
import { AuthFormLayout } from "@/app/(auth)/_components/AuthFormLayout";
import { LoadingContent } from "@/app/(auth)/(reg)/_components/LoadingContent";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useResendOtp } from "@/hooks/useResendOtp";
import { OtpResendButton } from "@/app/(auth)/_components/OTPResendButton";
import Link from "next/link";
import Image from "next/image";

const MAX_ATTEMPTS = 3;
const TIMEOUT_PERIOD = 180;

export const LoginWithOTP = ({ phoneNumber }: { phoneNumber: string }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const { timeLeft, canResend, startTimer } = useTimer(TIMEOUT_PERIOD);
  const router = useRouter();
  const { login } = useAuthStore();
  const { handleResend: resendOtp, isLoading: isResending } =
    useResendOtp(phoneNumber);

  useEffect(() => {
    startTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 4) return;

    setIsLoading(true);
    try {
      // 1. Сначала верифицируем код
      const { error: verifyError } = await authClient.phoneNumber.verify({
        phoneNumber,
        code,
        disableSession: false,
      });

      if (verifyError) throw verifyError;

      // 2. Получаем данные пользователя
      const response = await fetch("/api/auth/check-phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const userData = await response.json();

      if (!userData.exists) {
        throw new Error("Пользователь не найден");
      }

      // 3. Сохраняем данные в хранилище
      login(userData.user);

      // 4. Перенаправляем на главную
      router.replace("/");
    } catch (error) {
      console.error("Ошибка входа:", error);
      setCode("");
      setAttemptsLeft((prev) => prev - 1);
      setError(
        attemptsLeft <= 1
          ? "Попытки исчерпаны. Попробуйте позже"
          : `Неверный код. Осталось попыток: ${attemptsLeft - 1}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;
    await resendOtp({
      onSuccess: () => {
        startTimer();
        setAttemptsLeft(MAX_ATTEMPTS);
        setError("");
      },
      onError: (message) => setError(message),
    });
  };

  if (isLoading) {
    return <LoadingContent title="Проверка кода..." />;
  }

  return (
    <AuthFormLayout>
      <div className="flex flex-col gap-y-8">
        <h1 className="text-2xl font-bold text-[#414141] text-center">Вход</h1>
        <div>
          <p className="text-center text-[#8f8f8f]">Код из SMS</p>
          <form
            onSubmit={handleSubmit}
            className="w-65 mx-auto max-h-screen flex flex-col justify-center items-center"
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
              className="flex justify-center w-27.5 h-15 text-center text-2xl px-4 py-3 border border-[#bfbfbf] rounded focus:border-[#70c05b] focus:shadow-(--shadow-button-default) focus:bg-white focus:outline-none"
              autoComplete="one-time-code"
              required
            />
            {error && (
              <div className="text-red-500 text-center mt-2 text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              className={`${buttonStyles.base} ${
                code.length !== 4 ? buttonStyles.inactive : buttonStyles.active
              } [&&]:mt-8 mb-0`}
              disabled={code.length !== 4 || attemptsLeft <= 0}
            >
              Войти
            </button>
          </form>
        </div>

        <OtpResendButton
          canResend={canResend}
          timeLeft={timeLeft}
          onResendAction={handleResend}
          isLoading={isResending}
        />
        <Link
          href="/login"
          className="h-8 text-xs text-[#414141] hover:text-black w-30 flex items-center justify-center gap-x-2 mx-auto duration-300 cursor-pointer"
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
