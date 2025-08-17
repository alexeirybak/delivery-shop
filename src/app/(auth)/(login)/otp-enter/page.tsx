"use client";
import { LoginWithOTP } from "../login/_components/LoginWithOTP";
import { useSearchParams } from "next/navigation";
import { AuthFormLayout } from "../../_components/AuthFormLayout";
import { LoadingContent } from "../../(reg)/_components/LoadingContent";
import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { ErrorContent } from "../../(reg)/_components/ErrorContent";
import { PhoneOff } from "lucide-react";

export default function OTPLoginPage() {
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get("login") || "";
  const [status, setStatus] = useState<"sending" | "sent" | "error">("sending");
  const [error, setError] = useState("");

  // Отправляем OTP при загрузке страницы
  useEffect(() => {
    const sendOtp = async () => {
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
            },
          }
        );
      } catch (err) {
        setStatus("error");
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      }
    };

    if (phoneNumber) {
      sendOtp();
    }
  }, [phoneNumber]);

  const handleRetry = () => {
    setStatus("sending");
    setError("");
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
