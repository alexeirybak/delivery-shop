"use client";

import { AuthFormLayout } from "@/app/(auth)/_components/AuthFormLayout";
import { buttonStyles, formStyles } from "@/app/styles";
import { MailWarning, PlusCircle, HelpCircle, Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface UnverifiedEmailProps {
  email: string;
  setLoginAction: (value: string) => void;
  setShowUnverifiedEmailAction: (value: boolean) => void;
}

export const UnverifiedEmail = ({
  email,
  setLoginAction,
  setShowUnverifiedEmailAction,
}: UnverifiedEmailProps) => {
  const router = useRouter();
  return (
    <AuthFormLayout>
      <div className="flex flex-col gap-y-4 justify-center items-center">
        <MailWarning className="h-8 w-8 text-[#ff6633]" />

        <h2 className="text-2xl font-medium text-main-text tracking-tight">
          Требуется{" "}
          <span className="text-[#ff6633] font-semibold">подтверждение</span>
        </h2>

        <div className="w-full">
          <div className="w-full bg-white/95 rounded p-4 border border-gray-100 shadow-xs flex flex-col items-center">
            <p className="text-main-text text-sm font-light">
              Письмо отправлено на:
            </p>
            <p className="font-medium text-main-text mt-1 text-lg">{email}</p>
            <p className="text-xs text-gray-400 mt-2 font-light">
              Проверьте все папки, включая «Спам»
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-y-3">
          <button
            onClick={() => {
              setLoginAction("");
              setShowUnverifiedEmailAction(false);
            }}
            className={`${buttonStyles.active} rounded [&&]:w-full cursor-pointer`}
          >
            <span className="flex items-center justify-center gap-2 text-white font-medium py-3.5 px-6 text-sm">
              <PlusCircle className="h-5 w-5" />
              <span className="translate-y-px">Подтвердить и войти заново</span>
            </span>
          </button>

          <button
            onClick={() => {
              setLoginAction("");
              setShowUnverifiedEmailAction(false);
            }}
            className={`${formStyles.loginLink} [&&]:h-auto [&&]:my-auto text-primary hover:text-white w-full cursor-pointer`}
          >
            <span className="relative flex items-center justify-center gap-2 font-medium py-3.5 px-6 text-sm hover:*:text-white">
              <Search className="h-5 w-5 text-primary transition-colors duration-300" />
              <span className="translate-y-px">Использовать другой email</span>
            </span>
          </button>

          <button
            onClick={() => {
              setLoginAction("");
              setShowUnverifiedEmailAction(false);
              router.replace("/contacts");
            }}
            className="w-full rounded border border-gray-300 hover:bg-gray-300 duration-300 cursor-pointer"
          >
            <span className="flex items-center justify-center gap-2 font-medium py-3.5 px-6 text-sm">
              <HelpCircle className="h-5 w-5" />
              <span className="translate-y-px">Связаться с поддержкой</span>
            </span>
          </button>
        </div>
      </div>
    </AuthFormLayout>
  );
};
