"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "@/app/contexts/FormContext";
import { Loader } from "@/components/Loader";
import ErrorComponent from "@/components/ErrorComponent";
import { authClient } from "../../../../../lib/auth-clients";
import { redirect } from "next/navigation";
import PhoneCodeInput from "../../PhoneCodeInput";

type Status = "idle" | "verifying" | "success" | "error";

const VerifyPhonePage = () => {
  const { formData } = useFormContext();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);
  const router = useRouter();
  const verificationStarted = useRef(false);
  const [shouldRedirect, setShouldRedirect] = useState<{
    path: string;
    method: "replace" | "push";
  } | null>(null);

  useEffect(() => {
    if (shouldRedirect) {
      if (shouldRedirect.method === "replace") {
        router.replace(shouldRedirect.path);
      } else {
        router.push(shouldRedirect.path);
      }
    }
  }, [shouldRedirect, router]);

  useEffect(() => {
    if (status === "idle" && !verificationStarted.current && formData.phone) {
      verificationStarted.current = true;
      setStatus("verifying");

      const verifyPhone = async () => {
        try {
          // Отправляем код верификации
          const { error: sendError } = await authClient.phoneNumber.sendOtp({
            phoneNumber: formData.phone,
          });

          if (sendError) {
            throw new Error(sendError.message || "Ошибка отправки SMS");
          }

          setStatus("idle"); // Возвращаем в idle для ввода кода
        } catch (err) {
          setStatus("error");
          const errorMessage =
            err instanceof Error ? err.message : "Произошла ошибка";

          setError({
            error: err instanceof Error ? err : new Error("Ошибка верификации"),
            userMessage: errorMessage.includes("Invalid phone")
              ? "Некорректный номер телефона"
              : "Ошибка отправки SMS. Попробуйте снова",
          });
        }
      };

      verifyPhone();
    }
  }, [status, formData]);

  const handleSubmit = async (code: string) => {
    setStatus("verifying");

    try {
      const { error: verifyError } = await authClient.phoneNumber.verify({
        phoneNumber: formData.phone,
        code,
        updatePhoneNumber: true,
      });

      if (verifyError) {
        throw new Error(verifyError.message || "Ошибка верификации");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      const errorMessage =
        err instanceof Error ? err.message : "Произошла ошибка";

      setError({
        error: err instanceof Error ? err : new Error("Ошибка верификации"),
        userMessage: errorMessage.includes("Invalid code")
          ? "Неверный код подтверждения"
          : "Ошибка верификации. Попробуйте снова",
      });
    }
  };

  if (status === "verifying") {
    return <Loader />;
  }

  if (status === "error" && error) {
    return (
      <div className="absolute inset-0 z-100 flex items-center justify-center bg-[#fcd5bacc] min-h-screen">
        <div className="bg-white rounded shadow-(--shadow-button-default) p-8 max-w-md w-full mx-4 text-center">
          <ErrorComponent error={error.error} userMessage={error.userMessage} />
          <div className="flex flex-row justify-center gap-10">
            <button
              onClick={() =>
                setShouldRedirect({ path: "/register", method: "replace" })
              }
              className="w-35 mt-4 py-2 px-4 bg-[#E5FFDE] text-base text-[#70C05B] hover:bg-(--color-primary) hover:shadow-(--shadow-button-default) hover:text-white active:shadow-(--shadow-button-active) rounded duration-300 cursor-pointer"
            >
              Регистрация
            </button>
            <button
              onClick={() => {
                setStatus("idle");
                verificationStarted.current = false;
              }}
              className="w-35 mt-4 py-2 px-4 bg-[#E5FFDE] text-base text-[#70C05B] hover:bg-(--color-primary) hover:shadow-(--shadow-button-default) hover:text-white active:shadow-(--shadow-button-active) rounded duration-300 cursor-pointer"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    redirect("/login");
  }

  return (
    <PhoneCodeInput
      onSubmit={handleSubmit}
      onResend={() => {
        setStatus("idle");
        verificationStarted.current = false;
      }}
    />
  );
};


export default VerifyPhonePage;
