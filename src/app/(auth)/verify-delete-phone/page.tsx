"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/authStore";
import { AuthFormLayout } from "../_components/AuthFormLayout";
import { Loader2, Trash2, Mail, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import useTimer from "@/hooks/useTimer";
import { CONFIG } from "../../../../config/config";
import { formStyles } from "@/app/(auth)/styles";

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

  const deleteUserAccount = async (userId: string) => {
    try {
      const response = await fetch("/api/auth/delete-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при удалении аккаунта");
      }

      return await response.json();
    } catch (error) {
      console.error("Ошибка при удалении аккаунта:", error);
      throw error;
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

      // Код верный, удаляем аккаунт
      await deleteUserAccount(userId);
      await logout();
      router.push("/goodbye");

    } catch (error) {
      console.error("Ошибка верификации:", error);
      setError("Ошибка при удалении аккаунта");
      
      // При ошибке сбрасываем форму для полного перезапуска процесса
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
      <AuthFormLayout>
        <div className="flex flex-col gap-y-8">
          <div className="flex flex-col items-center">
            <Trash2 className="w-12 h-12 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-center">Удаление аккаунта</h1>
          </div>
          <p className="text-center text-red-600 font-medium">
            Внимание! Это действие необратимо. Все Ваши данные будут удалены без возможности восстановления.
          </p>
          
          <p className="text-center">
            Для подтверждения удаления аккаунта мы отправим SMS с кодом
            на телефон, по которому Вы регистрировались.
          </p>

          {error && (
            <div className="p-3 bg-[#ffc7c7] text-[#d80000] text-center rounded">{error}</div>
          )}

          <form
            onSubmit={handleSendCode}
            className="mx-auto flex flex-col justify-center"
            autoComplete="off"
          >
            <button
              type="submit"
              disabled={loading || !canResend}
              className="flex-1 flex flex-row items-center justify-center gap-x-3 bg-[#ffc7c7] hover:bg-[#d80000] text-[#d80000] hover:text-[#f2f2f2] px-4 py-2 h-10 rounded font-medium duration-300 text-center cursor-pointer disabled:bg-[#fcd5ba]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  Отправка...
                </>
              ) : !canResend ? (
                `Ждите ${timeLeft} сек`
              ) : (
                <>
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  Получить код подтверждения
                </>
              )}
            </button>
          </form>
        </div>
      </AuthFormLayout>
    );
  }

  return (
    <AuthFormLayout>
      <div className="flex flex-col gap-y-8">
        <div className="flex flex-col items-center">
          <Trash2 className="w-12 h-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-center">Последнее подтверждение</h1>
        </div>
        
        <p className="text-center text-red-600 font-medium">
          Вы собираетесь безвозвратно удалить свой аккаунт и все данные!
        </p>

        <p className="text-center">
          Введите код из SMS, отправленный на номер {phoneNumber}
        </p>

        {error && (
          <div className="p-3 bg-[#ffc7c7] text-[#d80000] rounded text-center">{error}</div>
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