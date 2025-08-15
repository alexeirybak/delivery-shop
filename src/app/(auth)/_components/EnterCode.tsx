"use client";

//import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { buttonStyles } from "../styles";
import useTimer from "@/hooks/useTimer";
import { useRegFormContext } from "@/app/contexts/RegFormContext";
import Link from "next/link";

interface EnterCodeProps {
  phoneNumber: string;
}

const MAX_ATTEMPTS = 3;

export const EnterCode = ({ phoneNumber }: EnterCodeProps) => {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const { timeLeft, canResend, startTimer } = useTimer(60);
  const { regFormData } = useRegFormContext();

  useEffect(() => {
    if (attemptsLeft <= 0) {
      router.push("/register");
    }
  }, [attemptsLeft, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 4) return;

    try {
      const { data: verifyData, error: verifyError } =
        await authClient.phoneNumber.verify({
          phoneNumber,
          code,
          disableSession: false,
        });

      if (verifyError) throw verifyError;

      setAttemptsLeft(MAX_ATTEMPTS);

      const passwordResponse = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: verifyData.user.id,
          password: regFormData.password,
        }),
      });

      if (!passwordResponse.ok) {
        const errorData = await passwordResponse.json();
        console.error("Детали ошибки:", errorData);
        throw new Error(errorData.error || "Ошибка установки пароля");
      }

      const updateData = {
        phoneNumber,
        surname: regFormData.surname,
        name: regFormData.name,
        password: regFormData.password,
        birthdayDate: regFormData.birthdayDate,
        region: regFormData.region,
        location: regFormData.location,
        gender: regFormData.gender,
        card: regFormData.card,
        hasCard: regFormData.card ? true : undefined,
      };

      const { error: updateError } = await authClient.updateUser(updateData);
      if (updateError) throw updateError;

      router.replace("/login");
    } catch (err) {
      console.error("Ошибка:", err);
      setCode(""); // Очищаем поле ввода
      setAttemptsLeft((prev) => prev - 1); // Уменьшаем количество попыток

      if (attemptsLeft <= 1) {
        setError("Попытки исчерпаны. Пожалуйста, зарегистрируйтесь снова");
        setTimeout(() => router.push("/register"), 2000);
      } else {
        setError(`Неверный код. Осталось попыток: ${attemptsLeft - 1}`);
      }
    }
  };

  const handleResend = async () => {
    try {
      const { error: sendError } = await authClient.phoneNumber.sendOtp({
        phoneNumber,
      });

      if (sendError) throw sendError;
      startTimer();
      setError(""); // Сбрасываем ошибку при повторной отправке
      setAttemptsLeft(MAX_ATTEMPTS); // Восстанавливаем попытки
    } catch {
      setError("Ошибка при отправке кода");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-[#414141] text-center">
        Регистрация
      </h1>

      <div className="flex flex-col gap-y-8">
        <p className="text-center text-[#8f8f8f] mb-3">Код из SMS:</p>
        <form
          onSubmit={handleSubmit}
          className="w-65 mx-auto max-h-100vh flex flex-col justify-center items-center"
          autoComplete="off"
        >
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]{4}"
            maxLength={4}
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/\D/g, ""));
              setError(""); // Сбрасываем ошибку при изменении кода
            }}
            className="flex justify-center w-27.5 h-15 text-center text-2xl px-4 py-3 border border-[#bfbfbf] rounded focus:border-[#70c05b] focus:shadow-(--shadow-button-default) focus:bg-white focus:outline-none"
            autoComplete="one-time-code"
            required
          />

          {error && (
            <div className="text-red-500 text-center mt-2 text-sm">{error}</div>
          )}

          <button
            type="submit"
            className={`${buttonStyles.base} ${
              code.length !== 4 ? buttonStyles.inactive : buttonStyles.active
            } [&&]:mt-8 mb-0`}
            disabled={attemptsLeft <= 0} // Блокируем кнопку при исчерпании попыток
          >
            Подтвердить
          </button>
        </form>
        {!canResend ? (
          <p className="text-[#414141] text-xs text-center">
            Запросить код повторно можно через <span>{timeLeft} секунд</span>
          </p>
        ) : (
          <button
            onClick={handleResend}
            className="text-xs underline text-[#ff6633] cursor-pointer text-center"
          >
            Отправить еще раз
          </button>
        )}
        <Link
          href="/register"
          className="h-8 text-xs text-[#414141] hover:text-black w-30 flex items-center justify-center gap-x-2 mx-auto duration-300 cursor-pointer"
        >
          {/* <Image
            src="/icons-auth/icon-arrow-left.svg"
            width={24}
            height={24}
            alt="Вернуться"
          /> */}
          Вернуться
        </Link>
      </div>
    </>
  );
};
