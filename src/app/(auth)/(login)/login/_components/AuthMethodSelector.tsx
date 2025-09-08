"use client";
import { AuthFormLayout } from "@/app/(auth)/_components/AuthFormLayout";
import { iconContainerStyles } from "@/app/styles";
import { Smartphone, Key, ArrowLeft } from "lucide-react";

interface AuthMethodSelectorProps {
  phoneNumber: string;
  onMethodSelectAction?: (method: "password" | "otp") => void;
  onBackAction?: () => void;
}

export const AuthMethodSelector: React.FC<AuthMethodSelectorProps> = ({
  phoneNumber,
  onMethodSelectAction = () => {},
  onBackAction = () => {},
}) => {
  const buttonStyles = `
    flex flex-col items-center justify-center
    p-4 rounded-lg border border-gray-200
    hover:shadow-md duration-300 cursor-pointer
    relative group w-full cursor-pointer duration-300
  `;

  return (
    <AuthFormLayout>
      <div className="animate-in zoom-in-95 relative">
        <div className="space-y-6 flex flex-col items-center">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Выберите способ входа</h2>
            <p>Для номера {phoneNumber} доступны следующие варианты:</p>
          </div>

          <div className="space-y-4 w-full">
            <button
              onClick={() => onMethodSelectAction("password")}
              className={buttonStyles}
            >
              <div className={iconContainerStyles}>
                <Key className="h-6 w-6 text-[#ff6633] group-hover:text-white" />
              </div>
              <span className="font-medium text-gray-900">Войти с паролем</span>
            </button>

            <button
              onClick={() => onMethodSelectAction("otp")}
              className={buttonStyles}
            >
              <div className={iconContainerStyles}>
                <Smartphone className="h-6 w-6 text-[#ff6633] group-hover:text-white" />
              </div>
              <span className="font-medium text-gray-900">
                Войти по SMS-коду
              </span>
            </button>
          </div>

          <button
            onClick={onBackAction}
            className="h-8 text-xs text-main-text hover:text-black w-30 flex items-center justify-center gap-x-2 mx-auto duration-300 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Вернуться
          </button>
        </div>
      </div>
    </AuthFormLayout>
  );
};
