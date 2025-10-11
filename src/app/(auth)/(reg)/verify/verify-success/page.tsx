"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { AuthFormLayout } from "../../../_components/AuthFormLayout";
import { buttonStyles } from "@/app/styles";

export default function VerifySuccessPage() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 5000);

    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [router]);

  return (
    <AuthFormLayout>
      <div className="p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary mb-6">
          <CheckCircle className="h-10 w-10 text-white" />
        </div>

        <h1 className="text-2xl font-bold text-main-text mb-2">
          Email успешно подтвержден!
        </h1>

        <p className="text-gray-600 mb-6">
          Ваш адрес электронной почты был успешно подтвержден. Теперь Вы можете
          войти в свой аккаунт.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => router.replace("/login")}
            className={`${buttonStyles.active} px-4 py-2 rounded cursor-pointer`}
          >
            Перейти к авторизации
          </button>

          <p className="text-sm text-gray-500">
            Автоматический переход через {secondsLeft}{" "}
            {secondsLeft % 10 === 1 && secondsLeft % 100 !== 11
              ? "секунду"
              : secondsLeft % 10 >= 2 &&
                  secondsLeft % 10 <= 4 &&
                  (secondsLeft % 100 < 10 || secondsLeft % 100 >= 20)
                ? "секунды"
                : "секунд"}
            ...
          </p>
        </div>
      </div>

      <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Нужна помощь?{" "}
          <Link href="/contacts" className="text-[#ff6633] hover:underline">
            Свяжитесь с поддержкой
          </Link>
        </p>
      </div>
    </AuthFormLayout>
  );
}
