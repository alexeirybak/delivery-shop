"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { MagneticButton } from "@/app/shared/magneticButton/MagneticButton";

export default function VerifySuccessPage() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/auth/login");
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
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6 py-12 bg-panel">
      <div className="flex flex-col items-center text-center space-y-5 max-w-md px-4">
        <div className="p-4 rounded-full bg-[rgba(109,241,255,0.1)] border border-[rgba(109,241,255,0.2)]">
          <CheckCircle className="h-10 w-10 text-cyan" />
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-text">
            Email успешно подтвержден!
          </h1>

          <p className="text-muted text-base leading-relaxed">
            Ваш адрес электронной почты был успешно подтвержден. Теперь Вы
            можете войти в свой аккаунт.
          </p>
        </div>

        <div className="space-y-4 w-full pt-4">
          <div className="flex justify-center">
            <MagneticButton
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                router.replace("/auth/login");
              }}
            >
              Перейти к авторизации
            </MagneticButton>
          </div>

          <p className="text-sm text-muted-soft">
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

      <div className="w-full px-8 py-4 border-t border-line mt-8">
        <p className="text-xs text-muted-soft text-center">
          Нужна помощь?{" "}
          <Link href="/contacts" className="text-cyan hover:underline">
            Свяжитесь с поддержкой
          </Link>
        </p>
      </div>
    </div>
  );
}
