// app/confirm-email-change/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthFormLayout } from "../../../(auth)/_components/AuthFormLayout";
import { Loader2, XCircle } from "lucide-react";

const ConfirmEmailChange = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {

      router.replace(
        `/api/verify-email-change?token=${encodeURIComponent(token)}`
      );
    } else {
      setStatus("error");
      setMessage("Неверная ссылка подтверждения");
    }
  }, [router, searchParams]);

  return (
    <AuthFormLayout>
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        {status === "loading" && (
          <>
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
            <p className="text-lg text-center">Подтверждение смены email...</p>
            <p className="text-sm text-gray-500 text-center mt-2">
              Перенаправление для обработки...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-2 text-center">
              Ошибка
            </h2>
            <p className="text-center text-gray-700 mb-4">{message}</p>
            <button
              onClick={() => router.push("/profile")}
              className="bg-[#ff6633] text-white px-6 py-2 rounded hover:bg-[#e55a2a] transition-colors"
            >
              Вернуться в профиль
            </button>
          </>
        )}
      </div>
    </AuthFormLayout>
  );
};

export default ConfirmEmailChange;
