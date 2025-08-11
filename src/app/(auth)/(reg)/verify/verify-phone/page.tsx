"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { authClient } from "../../../../../../lib/auth-clients";
import { useRegFormContext } from "@/app/contexts/RegFormContext";
import { EnterCode } from "../../_components/EnterCode";
import { LoadingContent } from "../../_components/LoadingContent";
import { ErrorContent } from "../../_components/ErrorContent";

export default function VerifyPhonePage() {
  const { regFormData } = useRegFormContext();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const isSent = useRef(false);
  const phone = regFormData.phone;

  const verifyPhone = useCallback(async () => {
    const onRequest = () => {
      setIsLoading(true);
      setError(null);
    };

    const onSuccess = () => {
      setShowCodeInput(true);
      setIsLoading(false);
    };

    const onError = (error: Error) => {
      setError(error.message || "Ошибка отправки SMS. Попробуйте снова");
      isSent.current = false;
      setIsLoading(false);
    };

    if (isSent.current) return;
    isSent.current = true;
    onRequest();

    try {
      const { error } = await authClient.phoneNumber.sendOtp({
        phoneNumber: phone,
      });

      if (error) throw error;
      onSuccess();
    } catch (error) {
      onError(error instanceof Error ? error : new Error("Неизвестная ошибка"));
    }
  }, [phone]); // Только phone как зависимость

  useEffect(() => {
    verifyPhone();
  }, [verifyPhone]);

  const handleRetry = useCallback(() => {
    isSent.current = false;
    verifyPhone();
  }, [verifyPhone]);

  return (
    <>
      {isLoading ? (
        <LoadingContent title="SMS" />
      ) : error ? (
        <ErrorContent
          error={error}
          secondaryAction={{
            label: "Попробовать снова",
            onClick: handleRetry,
          }}
        />
      ) : showCodeInput ? (
        <EnterCode phone={phone} />
      ) : null}
    </>
  );
}
