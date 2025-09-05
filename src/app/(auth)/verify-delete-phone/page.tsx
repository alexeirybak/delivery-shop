"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/authStore";
import { AuthFormLayout } from "../_components/AuthFormLayout";
import { Loader2, Trash2, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import useTimer from "@/hooks/useTimer";
import { CONFIG } from "../../../../config/config";
import { formStyles } from "@/app/(auth)/styles";
import { deleteUserAccount } from "../../../../utils/deleteUserAccount";
import { DeleteAccountInitialStep } from "@/app/(user-profile)/_components/DeleteAccountInitialStep";

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
      router.push("/goodbye");
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
    <AuthFormLayout>
      <div className="flex flex-col gap-y-8">
        <div className="flex flex-col items-center">
          <Trash2 className="w-12 h-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-center">
            Последнее подтверждение
          </h1>
        </div>

        <p className="text-center text-red-600 font-medium">
          Вы собираетесь безвозвратно удалить свой аккаунт и все данные!
        </p>

        <p className="text-center">
          Введите код из SMS, отправленный на номер +{phoneNumber}
        </p>

        {error && (
          <div className="p-3 bg-[#ffc7c7] text-[#d80000] rounded text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 items-center">
          <div className="flex flex-row gap-3 justify-center">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{4}"
              maxLength={4}
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, ""));
                setError("");
              }}
              className={`${formStyles.input} [&&]:w-27.5 [&&]:bg-white block text-center`}
              autoComplete="one-time-code"
              autoFocus
              required
            />

            <button
              onClick={handleVerifyCode}
              disabled={code.length !== 4 || verifying}
              className="flex-1 flex flex-row items-center justify-center gap-x-3 bg-[#ffc7c7] hover:bg-[#d80000] text-[#d80000] hover:text-[#f2f2f2] px-4 py-2 h-10 rounded font-medium duration-300 text-center cursor-pointer disabled:bg-[#fcd5ba]"
            >
              {verifying ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  Удаление...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 flex-shrink-0" />
                  Удалить аккаунт
                </>
              )}
            </button>
          </div>

          <button
            onClick={handleResendCode}
            disabled={!canResend}
            className="text-[#414141] hover:text-black text-sm underline duration-300 cursor-pointer disabled:opacity-50"
          >
            {canResend
              ? "Отправить код повторно"
              : `Повторить отправку через: ${timeLeft} сек`}
          </button>
        </div>
      </div>
    </AuthFormLayout>
  );
};

export default VerifyDeletePhonePage;
