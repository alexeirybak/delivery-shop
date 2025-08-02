import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { buttonStyles } from "./styles";
import useTimer from "@/hooks/useTimer";

const PhoneCodeInput = ({
  onSubmit,
  onResend,
}: {
  onSubmit: (code: string) => void;
  onResend: () => void;
}) => {
  const [code, setCode] = useState("");
  const router = useRouter();
  const { timeLeft, canResend, startTimer } = useTimer(60);

  const handleResend = () => {
    if (!canResend) return;
    
    startTimer();
    onResend();
  };

  const handleClose = () => {
    router.push("/");
  };

  return (
    <div className="absolute inset-0 z-100 flex items-center justify-center bg-[#fcd5bacc] min-h-screen text-[#414141]">
      <div className="bg-white rounded shadow-(--shadow-auth-form) w-full max-w-105 max-h-[100vh] overflow-y-auto flex flex-col gap-y-8 pb-8">
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="bg-[#f3f2f1] rounded duration-300 cursor-pointer"
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
        <h1 className="text-2xl font-bold text-[#414141] text-center">
          Регистрация
        </h1>
        <div>
          <p className="text-center text-[#8f8f8f] mb-3">Код из SMS:</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(code);
            }}
            className="w-65 mx-auto max-h-100vh flex flex-col justify-center overflow-y-auto"
            autoComplete="off"
          >
            <div className="flex justify-center">
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]{4}"
                maxLength={4}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="w-27.5 h-15 text-center text-2xl px-4 py-3 border border-[#bfbfbf] rounded focus:border-[#70c05b] focus:shadow-(--shadow-button-default) focus:bg-white focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className={`${buttonStyles.base} ${code.length !== 4 ? buttonStyles.inactive : buttonStyles.active} [&&]:mt-8 mb-0`}
            >
              Подтвердить
            </button>
          </form>
        </div>

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
        <button
          onClick={() => router.push("/register")}
          className="h-8 text-xs text-[#414141] hover:text-black w-30 flex items-center justify-center gap-x-2 mx-auto duration-300 cursor-pointer"
        >
          <Image
            src="/icons-auth/icon-arrow-left.svg"
            width={24}
            height={24}
            alt="Вернуться"
          />
          Вернуться
        </button>
      </div>
    </div>
  );
};

export default PhoneCodeInput;