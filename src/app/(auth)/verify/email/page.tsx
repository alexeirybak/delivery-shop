"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "@/app/context/FormContext";
import { Loader } from "@/components/Loader";
import ErrorComponent from "@/components/ErrorComponent";
import { authClient } from "../../../../../utils/auth-client";

type Status = "idle" | "verifying" | "registering" | "success" | "error";

const VerifyEmailPage = () => {
  const { formData } = useFormContext();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<{error: Error; userMessage: string} | null>(null);
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);


const handleCompleteRegistration = useCallback(async () => {
  if (isProcessing) return;
  
  try {
    setIsProcessing(true);
    setStatus("verifying");

    // 1. Верификация через Better-Auth (создает пользователя)
    await authClient.signUp.email(
      {
        name: formData.firstName,
        password: formData.password,
        email: formData.email,
        callbackURL: "/login",
      },
      {
        onSuccess: async () => {
          try {
            // 2. Дополняем профиль в вашей БД
            const res = await fetch("/api/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData),
            });

            if (!res.ok) {
              const error = await res.json();
              throw new Error(error.error || "Ошибка сохранения данных");
            }

            setStatus("success");
            router.push("/login");
          } catch (err) {
            throw new Error(`Ошибка сохранения: ${err instanceof Error ? err.message : String(err)}`);
          }
        },
        onError: (ctx) => {
          throw new Error(ctx.error?.message || "Ошибка верификации email");
        }
      }
    );

  } catch (err) {
    setStatus("error");
    setError({
      error: err instanceof Error ? err : new Error("Ошибка регистрации"),
      userMessage: err instanceof Error ? err.message : "Произошла ошибка"
    });
  } finally {
    setIsProcessing(false);
  }
}, [formData, router, isProcessing]);

  useEffect(() => {
    if (status === "idle") {
      handleCompleteRegistration();
    }
  }, [status, handleCompleteRegistration]);

  if (status === "verifying" || status === "registering") {
    return <Loader />;
  }

  if (status === "error" && error) {
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#fcd5bacc] min-h-screen">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 text-center">
          <ErrorComponent 
            error={error.error} 
            userMessage={error.userMessage}
          />
          <button
            onClick={() => router.push("/")}
            className="mt-4 py-2 px-4 bg-[#E5FFDE] text-base text-[#70C05B] hover:bg-(--color-primary) hover:shadow-(--shadow-button-default) hover:text-white active:shadow-(--shadow-button-active) rounded duration-300 cursor-pointer"
          >
            На главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#fcd5bacc] min-h-screen">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 text-center">
        {status === "success" ? (
          <>
            <h2 className="text-2xl font-bold text-(--color-primary) mb-6">
              Регистрация завершена!
            </h2>
            <p className="text-lg mb-6">
              Теперь вы можете войти в систему
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
            <p className="text-lg mb-6">
              Идет процесс регистрации...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;