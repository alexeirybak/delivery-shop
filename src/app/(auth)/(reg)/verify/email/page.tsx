"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "@/app/contexts/FormContext";
import { authClient } from "../../../../../../lib/auth-clients";
import MiniLoader from "@/components/MiniLoader";

type Status = "idle" | "verifying" | "success" | "error";

interface AppError {
  error: Error;
  userMessage: string;
}

const VerifyEmailPage = () => {
  const { formData } = useFormContext();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<AppError | null>(null);
  const router = useRouter();
  const registrationStarted = useRef(false);

  const handleReturnToRegister = async () => {
    router.replace("/register");
  };

  useEffect(() => {
    if (status === "idle" && !registrationStarted.current) {
      registrationStarted.current = true;
      setStatus("verifying");

      const registerUser = async () => {
        try {
          const registrationData = {
            phoneNumber: formData.phone,
            name: formData.name,
            email: formData.email,
            password: formData.password,
            surname: formData.surname,
            birthdayDate: formData.birthdayDate,
            region: formData.region,
            location: formData.location,
            gender: formData.gender,
            card: formData.card,
            hasCard: formData.card ? true : undefined,
          };

          await authClient.signUp.email(registrationData, {
            onSuccess: () => setStatus("success"),
            onError: () => {
              throw new Error("Ошибка верификации email");
            },
          });
        } catch (err) {
          setStatus("error");
          setError({
            error: err instanceof Error ? err : new Error(String(err)),
            userMessage: "Ошибка при отправке письма подтверждения",
          });
        }
      };

      registerUser();
    }
  }, [status, formData]);

  if (status === "idle" || status === "verifying") {
    return <MiniLoader />;
  }

  if (status === "error" && error) {
    return (
      <div className="absolute inset-0 z-100 flex items-center justify-center bg-[#fcd5bacc] min-h-screen">
        <div className="bg-white rounded shadow-(--shadow-button-default) p-8 max-w-md w-full mx-4 text-center">
          <div className="text-red-500 mb-4">
            <h3 className="font-bold text-lg">{error.userMessage}</h3>
            <p className="text-sm">{error.error.message}</p>
          </div>
          <button
            onClick={handleReturnToRegister}
            className="w-full py-2 px-4 bg-[#E5FFDE] text-base text-[#70C05B] hover:bg-(--color-primary) hover:shadow-(--shadow-button-default) hover:text-white active:shadow-(--shadow-button-active) rounded duration-300 cursor-pointer mt-6"
          >
            Вернуться к регистрации
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-100 flex items-center justify-center bg-[#fcd5bacc] min-h-screen">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 text-center">
        <h2 className="text-2xl font-bold text-(--color-primary) mb-6">
          Регистрация завершена!
        </h2>
        <p className="text-lg mb-6">
          На ваш email {formData.email} было отправлено письмо с подтверждением.
          Пожалуйста, проверьте Вашу почту и перейдите по ссылке для завершения
          регистрации. Ссылка активна в течение 24 часов.
        </p>
        <button
          onClick={() => router.replace("/login")}
          className="w-full py-2 px-4 bg-[#E5FFDE] text-base text-[#70C05B] hover:bg-(--color-primary) hover:shadow-(--shadow-button-default) hover:text-white active:shadow-(--shadow-button-active) rounded duration-300 cursor-pointer"
        >
          Перейти к авторизации
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
