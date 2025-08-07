"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { formStyles } from "../styles";

interface UserExistsErrorProps {
  phone?: string;
  email?: string;
  onClose: () => void;
}

export const UserExistsError = ({
  phone,
  email,
  onClose,
}: UserExistsErrorProps) => {
  const router = useRouter();

  return (
    <div className="absolute inset-0 z-100 flex items-center justify-center bg-[#fcd5bacc] min-h-screen text-[#414141]">
      <div className="bg-white rounded shadow-(--shadow-auth-form) w-full max-w-105 max-h-[100vh] overflow-y-auto flex flex-col gap-y-8 pb-8">
        <div className="flex justify-end">
          <button
            onClick={onClose}
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

        <h1 className="text-2xl font-bold text-center">Ошибка регистрации</h1>

        <div className="text-center px-4">
          {phone && (
            <p className="text-red-500 mb-6 px-3">
              Номер телефона +{phone} уже зарегистрирован
            </p>
          )}
          {email && (
            <p className="text-red-500 mb-6 px-3">
              Email {email} уже зарегистрирован
            </p>
          )}

          <div className="flex flex-col gap-4">
            <button
              onClick={() => router.replace("/login")}
              className={formStyles.loginLink}
            >
              Войти
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
