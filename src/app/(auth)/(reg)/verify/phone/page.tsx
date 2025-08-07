"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../../../../../../lib/auth-clients";
import { useFormContext } from "@/app/contexts/FormContext";
import ErrorComponent from "@/components/ErrorComponent";
import MiniLoader from "@/components/MiniLoader";
import { EnterCode } from "../../EnterCode";

export default function VerifyPhonePage() {
  const router = useRouter();
  const { formData } = useFormContext();
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const isSent = useRef(false);
  const phone = formData.phone;

  useEffect(() => {
    const verifyPhone = async () => {
      if (isSent.current) return;
      isSent.current = true;

      try {
        setIsLoading(true);

        const { error } = await authClient.phoneNumber.sendOtp({
          phoneNumber: phone,
        });

        if (error) throw error;

        setShowCodeInput(true);
      } catch (error) {
        setError({
          error:
            error instanceof Error ? error : new Error("Неизвестная ошибка"),
          userMessage: "Ошибка отправки SMS. Попробуйте снова",
        });
        isSent.current = false;
      } finally {
        setIsLoading(false);
      }
    };

    verifyPhone();
  }, [phone]);

  const handleClose = () => {
    router.push("/");
  };

  const handleSuccess = () => {
    router.push("/");
  };

  if (isLoading) return <MiniLoader />;
  if (error)
    return (
      <ErrorComponent error={error.error} userMessage={error.userMessage} />
    );
  if (showCodeInput)
    return (
      <EnterCode
        phone={phone}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    );

  return null;
}
