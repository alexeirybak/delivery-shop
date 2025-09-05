"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import useTimer from "@/hooks/useTimer";
import { CONFIG } from "../../../../config/config";
import { deleteUserAccount } from "../../../../utils/deleteUserAccount";
import { DeleteAccountInitialStep } from "@/app/(user-profile)/_components/DeleteAccountInitialStep";
import { DeleteAccountVerificationStep } from "@/app/(user-profile)/_components/DeleteAccountVerificationStep";

const VerifyDeletePhonePage = () => {
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const { timeLeft, canResend, startTimer } = useTimer(CONFIG.TIMEOUT_PERIOD);
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const phoneNumber = user?.phoneNumber;
  const userId = user?.id;

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canResend) {
      setError(`Подождите ${timeLeft} секунд перед повторной отправкой`);
      return;
    }

    setLoading(true);
    setError("");

    if (!phoneNumber) {
      setError("Номер телефона не найден");
      setLoading(false);
      return;
    }

    try {
      await authClient.phoneNumber.sendOtp(
        { phoneNumber },
        {
          onSuccess: () => {
            setCodeSent(true);
            setError("");
            startTimer();
          },
          onError: (ctx) => {
            setError(ctx.error?.message || "Ошибка при отправке SMS");
          },
        }
      );
    } catch (error) {
      console.error("Ошибка отправки кода:", error);
      setError("Ошибка при отправке кода");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 4 || !userId || !phoneNumber) return;

    setVerifying(true);
    setError("");

    try {
      const { error: verifyError } = await authClient.phoneNumber.verify({
        phoneNumber,
        code,
        disableSession: false,
      });

      if (verifyError) {
        throw new Error("Неверный код подтверждения");
      }

      await deleteUserAccount(userId);
      await logout();
      router.replace("/goodbye");
    } catch (error) {
      console.error("Ошибка верификации:", error);
      setError("Ошибка при удалении аккаунта");

      setTimeout(() => {
        setCodeSent(false);
        setCode("");
      }, 2000);
    } finally {
      setVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) {
      setError(`Подождите ${timeLeft} секунд перед повторной отправкой`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authClient.phoneNumber.sendOtp(
        { phoneNumber: phoneNumber! },
        {
          onSuccess: () => {
            setError("");
            startTimer();
          },
          onError: (ctx) => {
            setError(ctx.error?.message || "Ошибка при отправке SMS");
          },
        }
      );
    } catch (error) {
      console.error("Ошибка отправки кода:", error);
      setError("Ошибка при отправке кода");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value.replace(/\D/g, ""));
    setError("");
  };

  if (!codeSent) {
    return (
      <DeleteAccountInitialStep
        loading={loading}
        error={error}
        canResend={canResend}
        timeLeft={timeLeft}
        onSendCode={handleSendCode}
      />
    );
  }

  return (
    <DeleteAccountVerificationStep
      phoneNumber={phoneNumber}
      code={code}
      error={error}
      verifying={verifying}
      canResend={canResend}
      timeLeft={timeLeft}
      onCodeChange={handleCodeChange}
      onVerify={handleVerifyCode}
      onResend={handleResendCode}
    />
  );
};

export default VerifyDeletePhonePage;
