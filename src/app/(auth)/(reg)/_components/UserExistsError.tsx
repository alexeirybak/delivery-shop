"use client";

import { useRouter } from "next/navigation";
import { AuthFormLayout } from "../../_components/AuthFormLayout";
import { AlertCircle } from "lucide-react";

interface UserExistsErrorProps {
  phone?: string;
  email?: string;
}

export const UserExistsError = ({ phone, email}: UserExistsErrorProps) => {
  const router = useRouter();

  return (
    <AuthFormLayout>
      <div className="text-center space-y-6">
        <div className="flex flex-col items-center">
          <div className="p-3 bg-red-100 rounded-full mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-[#414141]">
            Ошибка регистрации
          </h1>
        </div>

        <div className="space-y-4">
          {phone && (
            <div className="bg-red-50 border-l-4 border-[#d80000] p-4 rounded-r">
              <p className="text-[#d80000] font-medium">
                Номер телефона <span className="font-semibold">+{phone}</span> уже зарегистрирован
              </p>
            </div>
          )}
          {email && (
            <div className="bg-red-50 border-l-4 border-[#d80000] p-4 rounded-r">
              <p className="text-[#d80000] font-medium">
                Email <span className="font-semibold">{email}</span> уже зарегистрирован
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={() => router.replace("/login")}
              className="w-full py-3 px-4  text-white rounded bg-[#ff6633] hover:shadow-(--shadow-article) active:shadow-(--shadow-button-active) duration-300 cursor-pointer"
            >
              Войти в аккаунт
            </button>
          </div>
        </div>
      </div>
    </AuthFormLayout>
  );
};