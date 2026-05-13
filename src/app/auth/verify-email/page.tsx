"use client";

import { useRegFormContext } from "@/app/contexts/RegFormContext";
import { authClient } from "@/lib/auth-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingContent } from "../register/_components/LoadingContent";
import { ErrorContent } from "../register/_components/ErrorContent";
import { SuccessSent } from "../register/_components/SuccessSent";

export default function VerifyEmailPage() {
  const { regFormData } = useRegFormContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const hasSentInitialRequest = useRef(false);
  const router = useRouter();

  const registerAndVerify = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!regFormData.email) {
        throw new Error("Email обязателен для верификации");
      }

      await authClient.signUp.email(
        {
          ...regFormData,
          email: regFormData.email,
          callbackURL: "/auth/verify-success",
        },
        {
          onSuccess: () => {
            setVerificationSent(true);
            setIsLoading(false);
          },
          onError: (ctx) => {
            setIsLoading(false);
            setVerificationSent(false);

            const errorMessage = ctx.error?.message || "Неизвестная ошибка";

            if (errorMessage.includes("already exists")) {
              setError("Пользователь с таким email уже существует");
            } else {
              setError(errorMessage);
            }
          },
        },
      );
    } catch (err) {
      setIsLoading(false);
      setVerificationSent(false);
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    }
  }, [regFormData]);

  useEffect(() => {
    if (!hasSentInitialRequest.current && regFormData.email) {
      hasSentInitialRequest.current = true;
      registerAndVerify();
    }
  }, [registerAndVerify, regFormData.email]);

  const handleToLogin = () => router.replace("/auth/login");
  const handleResend = () => {
    registerAndVerify();
  };

  return (
    <>
      {isLoading ? (
        <LoadingContent title="Отправка письма..." />
      ) : error ? (
        <ErrorContent
          error={error}
          primaryAction={{ label: "Войти", onClick: handleToLogin }}
          secondaryAction={{
            label: "Попробовать снова",
            onClick: handleResend,
          }}
        />
      ) : verificationSent ? (
        <SuccessSent />
      ) : null}
    </>
  );
}
