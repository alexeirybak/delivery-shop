"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "@/app/contexts/FormContext";
import ErrorComponent from "@/components/ErrorComponent";
import { authClient } from "../../../../../lib/auth-clients";
import MiniLoader from "@/components/MiniLoader";

type Status = "idle" | "verifying" | "success" | "error";

const VerifyEmailPage = () => {
  const { formData } = useFormContext();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);
  const router = useRouter();
  const registrationStarted = useRef(false);

  useEffect(() => {
    if (status === "idle" && !registrationStarted.current) {
      registrationStarted.current = true;
      setStatus("verifying");

      const registerUser = async () => {
        try {
          const registrationData = {
            phone: formData.phone,
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
            onError: (ctx) => {
              throw new Error(ctx.error?.message || "Ошибка верификации email");
            },
          });
        } catch (err) {
          setStatus("error");
          const errorMessage =
            err instanceof Error ? err.message : "Произошла ошибка";

          setError({
            error: err instanceof Error ? err : new Error("Ошибка регистрации"),
            userMessage: errorMessage.includes("Invalid email")
              ? "Некорректный email-адрес"
              : errorMessage.includes("User already exists")
                ? "Пользователь с таким email уже существует"
                : "Ошибка регистрации. Попробуйте снова",
          });
        }
      };

      registerUser();
    }
  }, [status, formData]);

  if (status === "verifying") {
    return <MiniLoader />;
  }

  if (status === "error" && error) {
    return (
      <div className="absolute inset-0 z-100 flex items-center justify-center bg-[#fcd5bacc] min-h-screen">
        <div className="bg-white rounded shadow-(--shadow-button-default) p-8 max-w-md w-full mx-4 text-center">
          <ErrorComponent error={error.error} userMessage={error.userMessage} />
          <div className="flex flex-row justify-center gap-10">
            <button
              onClick={() => router.replace("/register")}
              className="w-35 mt-4 py-2 px-4 bg-[#E5FFDE] text-base text-[#70C05B] hover:bg-(--color-primary) hover:shadow-(--shadow-button-default) hover:text-white active:shadow-(--shadow-button-active) rounded duration-300 cursor-pointer"
            >
              Регистрация
            </button>
            <button
              onClick={() => router.replace("/login")}
              className="w-35 mt-4 py-2 px-4 bg-[#E5FFDE] text-base text-[#70C05B] hover:bg-(--color-primary) hover:shadow-(--shadow-button-default) hover:text-white active:shadow-(--shadow-button-active) rounded duration-300 cursor-pointer"
            >
              Войти
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-100 flex items-center justify-center bg-[#fcd5bacc] min-h-screen">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 text-center">
        {status === "success" ? (
          <>
            <h2 className="text-2xl font-bold text-(--color-primary) mb-6">
              Регистрация завершена!
            </h2>
            <p className="text-lg mb-6">
              Зайдите в Ваш почтовый ящик, указанный при регистрации,
              подтвердите свой E-mail, и затем Вы сможете перейди к авторизации
            </p>
            <button
              onClick={() => router.push("/login")}
              className="py-2 px-4 bg-[#E5FFDE] text-base text-[#70C05B] hover:bg-(--color-primary) hover:shadow-(--shadow-button-default) hover:text-white active:shadow-(--shadow-button-active) rounded duration-300 cursor-pointer"
            >
              Перейти к авторизации
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-(--color-primary) mb-6">
              Подтверждение email
            </h2>
            <p className="text-lg mb-6">Идет процесс верификации...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
