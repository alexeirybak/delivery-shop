import { authClient } from "@/lib/auth-client";
import { useState } from "react";

interface ResendOtpOptions {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export const useResendOtp = (phoneNumber: string) => {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleResend = async (options: ResendOtpOptions) => {
    try {
      setIsLoading(true);
      await authClient.phoneNumber.sendOtp(
        { phoneNumber },
        {
          onSuccess: () => {
            options.onSuccess?.();
            setError("");
          },
          onError: (ctx) => {
            const message = ctx.error?.message || "Ошибка при отправке SMS";
            setError(message);
            options.onError?.(message);
          },
        }
      );
    } catch (error) {
      console.error("Ошибка отправки кода:", error);
      const message = "Ошибка при отправке кода";
      setError(message);
      options.onError?.(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleResend, error, isLoading };
};