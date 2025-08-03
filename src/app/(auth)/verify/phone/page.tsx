"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../../../../../lib/auth-clients";
import { Loader } from "@/components/Loader";
import { useFormContext } from "@/app/contexts/FormContext";

export default function VerifyPhonePage() {
  const router = useRouter();
  const { formData } = useFormContext();

  useEffect(() => {
    const sendSms = async () => {
      try {
        let phoneWithPlus = formData.phone;
        if (!phoneWithPlus.startsWith("+")) {
          phoneWithPlus = "+" + phoneWithPlus;
        }
        // Отправляем SMS только один раз
        const { error } = await authClient.phoneNumber.sendOtp({
          phoneNumber: phoneWithPlus,
        });

        if (error) throw error;

        // Перенаправляем на страницу ввода кода
        router.push(`/enter-code?phone=${encodeURIComponent(phoneWithPlus)}`);
      } catch (error) {
        console.error("Ошибка отправки SMS:", error);
      }
    };

    sendSms();
  }, [formData.phone, router]);

  return <Loader />;
}
