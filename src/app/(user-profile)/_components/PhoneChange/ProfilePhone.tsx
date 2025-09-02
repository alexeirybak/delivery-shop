import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { profileStyles } from "@/app/(auth)/styles";
import PhoneEditView from "./PhoneEditView";
import PhoneVerifyView from "./PhoneVerifyView";
import PhoneDisplayView from "./PhoneDisplayView";
import AlertMessage from "../AlertMessage";
import PhoneInput from "./PhoneInput";
import { authClient } from "@/lib/auth-client";

const MAX_ATTEMPTS = 3;
const TIMEOUT_PERIOD = 180;

const ProfilePhone = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [verificationStep, setVerificationStep] = useState<"edit" | "verify">("edit");
  const [code, setCode] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [timeLeft, setTimeLeft] = useState(TIMEOUT_PERIOD);
  const [canResend, setCanResend] = useState(false);
  
  const { user, fetchUserData } = useAuthStore();
  const isPhoneRegistered = user?.phoneNumberVerified === true;
  const currentPhone = user?.phoneNumber || "";

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const startTimer = () => {
    setTimeLeft(TIMEOUT_PERIOD);
    setCanResend(false);
  };

  useEffect(() => {
    if (user) {
      setNewPhoneNumber(user.phoneNumber || "");
    }
  }, [user]);

  const handleCancel = () => {
    setNewPhoneNumber(currentPhone);
    setIsEditing(false);
    setVerificationStep("edit");
    setError("");
    setCode("");
    setAttemptsLeft(MAX_ATTEMPTS);
  };

  const handlePhoneChange = (value: string) => {
    setNewPhoneNumber(value);
    setError("");
  };

  const handleSave = async () => {
    if (!user) return;

    if (newPhoneNumber === currentPhone) {
      setError("Новый номер телефона совпадает с текущим");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      if (!isPhoneRegistered) {
        await updatePhoneDirectly();
      } else {
        await sendVerificationCode();
      }
    } catch (error) {
      console.error("Ошибка:", error);
      setError("Произошла неизвестная ошибка");
    } finally {
      setIsSaving(false);
    }
  };

  const updatePhoneDirectly = async () => {
    const response = await fetch("/api/auth/update-phone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phoneNumber: newPhoneNumber,
        userId: user?.id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      return;
    }

    await fetchUserData();
    alert("Номер телефона успешно обновлен!");
    setIsEditing(false);
  };

  const sendVerificationCode = async () => {
    if (!currentPhone) {
      setError("Нет текущего номера телефона для подтверждения");
      return false;
    }

    setIsSendingOTP(true);
    setError("");

    try {
      await authClient.phoneNumber.sendOtp(
        { phoneNumber: currentPhone },
        {
          onSuccess: () => {
            setIsSendingOTP(false);
            setVerificationStep("verify");
            startTimer();
          },
          onError: (ctx) => {
            setIsSendingOTP(false);
            setError(ctx.error?.message || "Ошибка при отправке SMS");
          },
        }
      );
      return true;
    } catch (error) {
      setIsSendingOTP(false);
      setError(error instanceof Error ? error.message : "Неизвестная ошибка");
      return false;
    }
  };

  const verifyCodeAndUpdatePhone = async () => {
    if (code.length !== 4) return;

    setIsSaving(true);

    try {
      const { error: verifyError } = await authClient.phoneNumber.verify({
        phoneNumber: currentPhone,
        code,
        disableSession: false,
      });

      if (verifyError) throw verifyError;

      await updatePhoneAfterVerification();
    } catch (error) {
      handleVerificationError(error);
    } finally {
      setIsSaving(false);
    }
  };

  const updatePhoneAfterVerification = async () => {
    const response = await fetch("/api/auth/update-phone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: newPhoneNumber, userId: user?.id }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Ошибка при обновлении номера");
    }

    await fetchUserData();
    alert("Номер телефона успешно обновлен!");
    setIsEditing(false);
    setVerificationStep("edit");
    setCode("");
    setAttemptsLeft(MAX_ATTEMPTS);
  };

  const handleVerificationError = (error: unknown) => {
    console.error("Ошибка верификации:", error);
    setCode("");
    setAttemptsLeft((prev) => prev - 1);

    if (attemptsLeft <= 1) {
      setError("Попытки исчерпаны. Начните процесс заново");
      setTimeout(() => handleCancel(), 2000);
    } else {
      setError(`Неверный код. Осталось попыток: ${attemptsLeft - 1}`);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    await sendVerificationCode();
  };

  return (
    <div className="mb-8">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <h3 className={profileStyles.sectionTitle}>Телефон</h3>

        {verificationStep === "edit" && !isEditing ? (
          <PhoneDisplayView onEdit={() => setIsEditing(true)} />
        ) : verificationStep === "edit" && isEditing ? (
          <PhoneEditView
            onCancel={handleCancel}
            onSave={handleSave}
            isSaving={isSaving}
            isSendingOTP={isSendingOTP}
          />
        ) : verificationStep === "verify" ? (
          <PhoneEditView
            onCancel={handleCancel}
            isSaving={isSaving}
            isSendingOTP={isSendingOTP}
            isVerificationMode={true}
          />
        ) : null}
      </div>

      <PhoneInput
        value={newPhoneNumber}
        onChange={handlePhoneChange}
        placeholder="Введите новый номер телефона"
        disabled={!isEditing || verificationStep === "verify"}
      />

      {isEditing && !isPhoneRegistered && (
        <AlertMessage
          type="success"
          message="Вы можете изменить телефон без подтверждения"
        />
      )}

      {isEditing && isPhoneRegistered && (
        <AlertMessage
          type="warning"
          message="Для смены телефона потребуется подтверждение через код, отправленный на Ваш текущий номер"
        />
      )}

      {error && (
        <AlertMessage
          type="error"
          message={error}
        />
      )}

      {verificationStep === "verify" && (
        <PhoneVerifyView
          currentPhone={currentPhone}
          code={code}
          onCodeChange={(value) => {
            setCode(value.replace(/\D/g, ""));
            setError("");
          }}
          onVerify={verifyCodeAndUpdatePhone}
          onResendCode={handleResendCode}
          isSaving={isSaving}
          canResend={canResend}
          timeLeft={timeLeft}
        />
      )}
    </div>
  );
};

export default ProfilePhone;