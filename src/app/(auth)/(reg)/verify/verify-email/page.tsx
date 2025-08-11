"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useRegFormContext } from "@/app/contexts/RegFormContext";
import { authClient } from "../../../../../../lib/auth-clients";
import { AuthFormLayout } from "@/app/(auth)/_components/AuthFormLayout";
import { MailCheck, MailWarning } from "lucide-react";
import { buttonStyles } from "@/app/(auth)/styles";
import { LoadingContent } from "../../_components/LoadingContent";
import { ErrorContent } from "../../_components/ErrorContent";

type VerifyAccountProps = {
  onReturn?: () => void;
};

export default function VerifyEmailPage({ onReturn }: VerifyAccountProps) {
  const { regFormData } = useRegFormContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const hasSentInitialRequest = useRef(false);

  const handleReturn = onReturn || (() => router.replace("/register"));

  const verifyAccount = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const userData = {
        name: regFormData.name,
        email: regFormData.email,
        password: regFormData.password,
        phoneNumber: regFormData.phone,
        surname: regFormData.surname,
        birthdayDate: regFormData.birthdayDate,
        region: regFormData.region,
        location: regFormData.location,
        gender: regFormData.gender,
        card: regFormData.card,
        hasCard: regFormData.card ? true : undefined,
      };

      await authClient.signUp.email(
        {
          ...userData,
          callbackURL: "/verify/success",
        },
        {
          onSuccess: () => {
            setVerificationSent(true);
            setIsLoading(false);
          },
          onError: (ctx) => {
            setIsLoading(false);
            setVerificationSent(false);
            setError(ctx.error?.message || "Неизвестная ошибка");
          },
        }
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
      verifyAccount();
    }
  }, [verifyAccount, regFormData.email]);

  const handleResend = () => {
    verifyAccount();
  };

  const renderSuccessContent = () => (
    <div className="space-y-6 flex flex-col items-center">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-3 bg-(--color-primary) rounded-full">
          <MailCheck className="h-8 w-8 text-white" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Письмо отправлено!
          </h2>
          <p className="text-gray-600 max-w-md">
            Мы отправили email с подтверждением на{" "}
            <span className="font-semibold text-[#ff6633]">
              {regFormData.email}
            </span>
            . Пожалуйста, проверьте и следуйте инструкциям.
          </p>
        </div>
      </div>

      <div className="space-y-3 w-full">
        <button
          onClick={() => router.replace("/login")}
          className={`${buttonStyles.active} px-4 py-2 rounded cursor-pointer w-full`}
        >
          Перейти к авторизации
        </button>
      </div>
    </div>
  );

  return (
    <AuthFormLayout>
      {isLoading ? (
        <LoadingContent title="письма" />
      ) : error ? (
        <ErrorContent
          error={error}
          icon={<MailWarning className="h-8 w-8 text-red-600" />}
          primaryAction={{
            label: "Вернуться",
            onClick: handleReturn,
          }}
          secondaryAction={{
            label: "Попробовать снова",
            onClick: handleResend,
          }}
        />
      ) : verificationSent ? (
        renderSuccessContent()
      ) : null}
    </AuthFormLayout>
  );
}
