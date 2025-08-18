"use client";
import { LoginWithOTP } from "../login/_components/LoginWithOTP";
import { useSearchParams } from "next/navigation";
import { AuthFormLayout } from "../../_components/AuthFormLayout";
import { LoadingContent } from "../../(reg)/_components/LoadingContent";
import { authClient } from "@/lib/auth-client";
import { useState, useEffect, useRef } from "react";
import { ErrorContent } from "../../(reg)/_components/ErrorContent";
import { PhoneOff } from "lucide-react";

export default function OTPLoginPage() {
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get("login") || "";
  const [status, setStatus] = useState<"sending" | "sent" | "error">("sending");
  const [error, setError] = useState("");
  const isSentRef = useRef(false); // Флаг для отслеживания отправки

  // Отправляем OTP при загрузке страницы
  useEffect(() => {
    const sendOtp = async () => {
      if (isSentRef.current || !phoneNumber) return;
      
      isSentRef.current = true;
      try {
        await authClient.phoneNumber.sendOtp(
          { phoneNumber },
          {
            onSuccess: () => {
              setStatus("sent");
            },
            onError: (ctx) => {
              setStatus("error");
              setError(ctx.error?.message || "Ошибка при отправке SMS");
              isSentRef.current = false; // Сбрасываем флаг при ошибке
            },
          }
        );
      } catch (err) {
        setStatus("error");
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
        isSentRef.current = false; // Сбрасываем флаг при ошибке
      }
    };

    sendOtp();
  }, [phoneNumber]);

  const handleRetry = () => {
    setStatus("sending");
    setError("");
    isSentRef.current = false; // Сбрасываем флаг при повторной попытке
  };

  if (status === "sending") {
    return (
      <AuthFormLayout>
        <LoadingContent title={`Отправка SMS на номер +${phoneNumber}`} />
      </AuthFormLayout>
    );
  }

  if (status === "error") {
    return (
      <AuthFormLayout>
        <ErrorContent
          error={error}
          icon={<PhoneOff className="h-8 w-8 text-red-600" />}
          primaryAction={{
            label: "Попробовать снова",
            onClick: handleRetry,
          }}
        />
      </AuthFormLayout>
    );
  }

  return <LoginWithOTP phoneNumber={phoneNumber} />;
}