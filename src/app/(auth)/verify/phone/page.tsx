"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../../../../../lib/auth-clients";
import { useFormContext } from "@/app/contexts/FormContext";
import ErrorComponent from "@/components/ErrorComponent";
import MiniLoader from "@/components/MiniLoader";

export default function VerifyPhonePage() {
  const router = useRouter();
  const { formData } = useFormContext();
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const isSent = useRef(false);
  const phone = formData.phone;

  useEffect(() => {
    const sendSms = async () => {
      if (isSent.current) return;
      isSent.current = true;

      try {
        setIsLoading(true);

        const { error } = await authClient.phoneNumber.sendOtp({
          phoneNumber: phone,
        });

        if (error) throw error;

        setIsSuccess(true);
      } catch (error) {
        setError({
          error: error instanceof Error ? error : new Error("Неизвестная ошибка"),
          userMessage: "Ошибка отправки SMS. Попробуйте снова",
        });
        isSent.current = false;
      } finally {
        setIsLoading(false);
      }
    };

    sendSms();
  }, [phone]);

  useEffect(() => {
    if (isSuccess) {
      router.push("/enter-code");
    }
  }, [isSuccess, router]);

  if (isLoading) return <MiniLoader />;
  if (error) return <ErrorComponent error={error.error} userMessage={error.userMessage} />;

  return null;
}