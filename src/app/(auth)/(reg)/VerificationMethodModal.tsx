"use client";

import Link from "next/link";
import { useFormContext } from "@/app/contexts/FormContext";

export default function VerificationMethodModal() {
  const { formData } = useFormContext();
  const { phone, email } = formData;

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-[#fcd5bacc] min-h-screen">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 text-center">
        <h2 className="text-2xl font-bold text-(--color-primary) mb-6">
          Подтверждение аккаунта
        </h2>

        <p className="text-lg mb-6">
          Выберите способ подтверждения для завершения регистрации, в
          азвисимости от которого Ваш аккаунт будет привязан либо к номеру
          телефона, либо к email:
        </p>

        <div className="flex flex-col gap-4 mb-6">
          <Link
            href="/verify/phone"
            className="py-2 px-4 bg-[#E5FFDE] text-base text-[#70C05B] hover:bg-(--color-primary) hover:shadow-(--shadow-button-default) hover:text-white active:shadow-(--shadow-button-active) rounded duration-300 cursor-pointer"
          >
            По SMS на телефон
            <span className="block text-sm mt-1">+{phone}</span>
          </Link>
          <p className="text-gray-500">— или —</p>
          <Link
            href="/verify/email"
            className="py-2 px-4 bg-[#E5FFDE] text-base text-[#70C05B] hover:bg-(--color-primary) hover:shadow-(--shadow-button-default) hover:text-white active:shadow-(--shadow-button-active) rounded duration-300 cursor-pointer"
          >
            По ссылке на email
            <span className="block text-sm mt-1">{email}</span>
          </Link>
        </div>

        <Link href="/" className="text-[#414141] hover:underline text-sm">
          Отменить регистрацию
        </Link>
      </div>
    </div>
  );
}
