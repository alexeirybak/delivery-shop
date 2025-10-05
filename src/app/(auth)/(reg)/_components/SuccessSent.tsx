"use client";

import { MailCheck } from "lucide-react";
import { buttonStyles } from "@/app/styles";
import { useRegFormContext } from "@/app/contexts/RegFormContext";
import { useRouter } from "next/navigation";

export const SuccessSent = () => {
  const { regFormData } = useRegFormContext();
  const router = useRouter();

  return (
    <div className="space-y-6 flex flex-col items-center">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-3 bg-primary rounded-full">
          <MailCheck className="h-8 w-8 text-white" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Письмо отправлено!
          </h2>
          <p className="text-gray-600 max-w-md">
            Мы отправили email с подтверждением на{" "}
            <span className="font-semibold text-[#ff6633]">
              {regFormData.email}
            </span>
            . Пожалуйста, проверьте и следуйте инструкциям.
          </p>
        </div>
      </div>

      <div className="space-y-3 w-full">
        <button
          onClick={() => router.replace("/login")}
          className={`${buttonStyles.active} px-4 py-2 rounded cursor-pointer w-full`}
        >
          Перейти к авторизации
        </button>
      </div>
    </div>
  );
};
