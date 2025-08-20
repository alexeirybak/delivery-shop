"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { AuthFormLayout } from "../../../_components/AuthFormLayout";
import { buttonStyles, formStyles } from "../../../styles";
import { Loader2, Phone, KeyRound, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import PasswordInput from "../../../_components/PasswordInput";
import { InputMask } from "@react-input/mask";
import { isPasswordValid } from "../../../../../../utils/validation/passValid";

const PhonePasswordReset = () => {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [step, setStep] = useState<"request" | "verify">("request");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    setError(null);
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: resetError } =
        await authClient.phoneNumber.requestPasswordReset({
          phoneNumber: phone,
        });

      if (resetError) {
        throw new Error(resetError.message || "Не удалось отправить код");
      }

      setStep("verify");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Сначала проверяем OTP через BetterAuth
      const { error: resetError } = await authClient.phoneNumber.resetPassword({
        phoneNumber: phone,
        otp,
        newPassword,
      });

      if (resetError) {
        throw new Error(resetError.message || "Неверный OTP код");
      }

      // 2. Если OTP верный, обновляем пароль в нашей БД
      const response = await fetch("/api/auth/reset-phone-pass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: phone,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Не удалось обновить пароль в системе");
      }

      // Пароль успешно изменен!
      router.replace("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  if (step === "verify") {
    return (
      <AuthFormLayout>
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-col items-center">
            <MessageCircle className="w-12 h-12 text-(--color-primary) mb-4" />
            <h1 className="text-2xl font-bold text-center">
              Введите код из SMS
            </h1>
          </div>

          <p className="text-center">
            Мы отправили код на номер: <strong>{phone}</strong>
          </p>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <form
            onSubmit={handleResetPassword}
            className="flex flex-col gap-y-4"
          >
            <div>
              <label htmlFor="otp" className={formStyles.label}>
                Код подтверждения
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={formStyles.input}
                required
                placeholder="Введите 4-значный код"
                maxLength={4}
              />
            </div>
            <div>
              <PasswordInput
                id="password"
                label="Новый пароль"
                value={newPassword}
                onChangeAction={handlePasswordChange}
                showPassword={showNewPassword}
                togglePasswordVisibilityAction={() =>
                  setShowNewPassword(!showNewPassword)
                }
                showRequirements={true}
                inputClass={
                  newPassword.length > 0 && !isPasswordValid(newPassword)
                    ? "border-red-500"
                    : ""
                }
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`${buttonStyles.active} rounded [&&]:w-full [&&]:h-10 cursor-pointer flex items-center justify-center gap-2`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  Сохранение...
                </>
              ) : (
                "Установить новый пароль"
              )}
            </button>
          </form>
        </div>
      </AuthFormLayout>
    );
  }

  return (
    <AuthFormLayout>
      <div className="flex flex-col gap-y-6">
        <div className="flex flex-col items-center">
          <KeyRound className="w-12 h-12 text-(--color-primary) mb-4" />
          <h1 className="text-2xl font-bold text-center">
            Сброс пароля для телефона
          </h1>
        </div>

        <p className="text-center">
          Введите номер телефона, на который придет код для сброса пароля
        </p>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleRequestReset}
          className="flex flex-col gap-y-4 mx-auto"
        >
          <div>
            <label htmlFor="phone" className={formStyles.label}>
              Номер телефона
            </label>

            <InputMask
              mask="+7 (___) ___-__-__"
              replacement={{ _: /\d/ }}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (___) ___-__-__"
              className={formStyles.input}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${buttonStyles.active} rounded [&&]:w-full [&&]:h-10 cursor-pointer flex items-center justify-center gap-2`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                Отправка...
              </>
            ) : (
              <>
                <Phone className="w-4 h-4" />
                Отправить код
              </>
            )}
          </button>
        </form>
      </div>
    </AuthFormLayout>
  );
};

export default PhonePasswordReset;
