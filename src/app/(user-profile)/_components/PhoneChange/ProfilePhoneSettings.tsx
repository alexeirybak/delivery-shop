import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { profileStyles } from "@/app/(auth)/styles";
import PhoneEditView from "./PhoneEditView";
import PhoneVerifyView from "./PhoneVerifyView";
import AlertMessage from "../AlertMessage";
import PhoneInput from "./PhoneInput";
import { authClient } from "@/lib/auth-client";
import EditButton from "./EditButton";
import useTimer from "@/hooks/useTimer"; 
import { CONFIG } from "../../../../../config/config";

const ProfilePhone = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [verificationStep, setVerificationStep] = useState<"edit" | "verify">("edit");
  const [code, setCode] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(CONFIG.MAX_ATTEMPTS);
  const { user, fetchUserData } = useAuthStore();
  const isPhoneRegistered = user?.phoneNumberVerified === true;
  const currentPhone = user?.phoneNumber || "";


  const { timeLeft, canResend, startTimer } = useTimer(CONFIG.TIMEOUT_PERIOD);

  useEffect(() => {
    if (user) {
      setNewPhoneNumber(currentPhone);
    }
  }, [currentPhone, user]);

  const handleCancel = () => {
    setNewPhoneNumber(currentPhone);
    setIsEditing(false);
    setVerificationStep("edit");
    setError("");
    setCode("");
    setAttemptsLeft(CONFIG.MAX_ATTEMPTS); 
  };

  const handlePhoneChange = (value: string) => {
    setNewPhoneNumber(value);
    setError("");
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
      setError(
        error instanceof Error ? error.message : "Произошла неизвестная ошибка"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const sendVerificationCode = async () => {
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

      updatePhoneDirectly();
      setVerificationStep("edit");
      setCode("");
      setAttemptsLeft(CONFIG.MAX_ATTEMPTS);
    } catch (error) {
      handleVerificationError(error);
    } finally {
      setIsSaving(false);
    }
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
          <EditButton onEdit={() => setIsEditing(true)} />
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

      {error && <AlertMessage type="error" message={error} />}

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