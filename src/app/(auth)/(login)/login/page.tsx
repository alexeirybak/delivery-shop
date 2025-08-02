"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Tooltip from "../../(reg)/Tooltip";
import EmailInput from "../../(reg)/EmailInput";
import { buttonStyles } from "../../styles";
import MiniLoader from "@/components/MiniLoader";


const LoginEmailPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    router.push("/");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes("@")) {
      setError("Пожалуйста, введите корректный email");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const { exists, verified } = await response.json();

      if (!exists) {
        setError("Аккаунт с таким email не зарегистрирован");
        return;
      }

      if (!verified) {
        setError("Email не подтвержден. Зайдите в свою почту");
        return;
      }

      router.push(`/password?email=${encodeURIComponent(email)}`);
    } catch {
      setError("Ошибка при проверке email");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <MiniLoader />;

  return (
    <div className="absolute inset-0 z-100 flex items-center justify-center bg-[#fcd5bacc] min-h-screen text-[#414141]">
      <div className="bg-white rounded shadow-(--shadow-auth-form) w-full max-w-105 max-h-[100vh] overflow-y-auto">
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="bg-[#f3f2f1] rounded duration-300 cursor-pointer mb-8"
            aria-label="Закрыть"
          >
            <Image
              src="/icons-products/icon-closer.svg"
              width={24}
              height={24}
              alt="Закрыть"
            />
          </button>
        </div>

        <h1 className="text-2xl font-bold text-center mb-8">Вход</h1>

        <form
          onSubmit={handleSubmit}
          className="w-65 mx-auto max-h-100vh flex flex-col justify-center overflow-y-auto"
          autoComplete="off"
        >
          <div className="w-full flex flex-row flex-wrap justify-center gap-x-8 gap-y-4 relative">
            <div className="flex flex-col gap-y-4 items-start">
              <EmailInput
                value={email}
                onChangeAction={handleChange}
                inputClass="h-15"
              />
              {error && <Tooltip text={error} />}
            </div>
          </div>

          <button
            type="submit"
            disabled={!email.includes("@") || isLoading}
            className={`
              ${buttonStyles.base}
                
              ${
                !email.includes("@")
                  ? "cursor-not-allowed hover:bg-[#fcd5ba] hover:text-[#ff6633]"
                  : "hover:bg-[#ff6633] hover:text-white hover:shadow-(--shadow-article)"
              }
              active:shadow-(--shadow-button-active)
              transition-colors duration-200
            `}
          >
            Вход
          </button>

          <div className="flex flex-row flex-wrap mb-10 mx-auto text-xs">
            <Link
              href="/register"
              className="h-8 text-(--color-primary) hover:text-white active:text-white border-1 border-(--color-primary) bg-white hover:bg-(--color-primary) active:shadow-(--shadow-button-default) w-30 rounded flex items-center justify-center duration-300"
            >
              Регистрация
            </Link>
            <Link
              href="/forgot-password"
              className="h-8 text-[#414141] hover:text-black w-30 flex items-center justify-center duration-300"
            >
              Забыли пароль?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginEmailPage;
