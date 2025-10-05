import { useAuthStore } from "@/store/authStore";
import { formStyles, profileStyles } from "@/app/styles";
import { Mail, Edit } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { CONFIG } from "../../../../config/config";
import { AuthFormLayout } from "@/app/(auth)/_components/AuthFormLayout";
import { SuccessChangeEmail } from "./SuccessChangeEmail";
import { authClient } from "@/lib/auth-client";
import AlertMessage from "./AlertMessage";

const ProfileEmail = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const { user, fetchUserData } = useAuthStore();

  const isTempEmail = user?.email?.endsWith(CONFIG.TEMPORARY_EMAIL_DOMAIN);
  const hasNoEmail = !user?.email || user.email.trim() === "" || isTempEmail;
  const isPhoneRegistered = user?.phoneNumberVerified === true;

  useEffect(() => {
    if (user) {
      setEmail(isTempEmail ? "" : user.email || "");
    }
  }, [isTempEmail, user]);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError("");
  };

  const handleCancel = () => {
    setEmail(isTempEmail ? "" : user?.email || "");
    setIsEditing(false);
    setError("");
  };

  const handleSave = async () => {
    if (!user) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Пожалуйста, введите корректный email адрес");
      return;
    }

    const currentDisplayEmail = isTempEmail ? "" : user.email || "";
    if (email === currentDisplayEmail) {
      setError("Новый email совпадает с текущим");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      if (isPhoneRegistered) {
        await updateEmailDirectly();
      } else {
        const response = await authClient.changeEmail({
          newEmail: email,
          callbackURL: "/login",
        });

        if (response.error) {
          if (response.error.code === "COULDNT_UPDATE_YOUR_EMAIL") {
            throw new Error("Этот email уже используется другим пользователем");
          } else {
            throw new Error(response.error.message || "Ошибка при смене email");
          }
        }

        setShowSuccess(true);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Ошибка при сохранении:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Произошла неизвестная ошибка при смене email");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const updateEmailDirectly = async () => {
    const response = await fetch("/api/auth/update-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, userId: user?.id }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      return;
    }

    await fetchUserData();
    alert("Email успешно обновлен!");
    setIsEditing(false);
  };

  if (showSuccess) {
    return (
      <AuthFormLayout>
        <SuccessChangeEmail email={user?.email || ""} newEmail={email} />
      </AuthFormLayout>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <h3 className={profileStyles.sectionTitle}>Email</h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className={profileStyles.editButton}
          >
            <Edit className="h-4 w-4 mr-1" />
            Редактировать
          </button>
        ) : (
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={handleCancel}
              className={profileStyles.cancelButton}
            >
              Отмена
            </button>
            <button onClick={handleSave} className={profileStyles.saveButton}>
              {isSaving ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        )}
      </div>

      <div className={profileStyles.inputContainer}>
        <input
          id="email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          className={`${formStyles.input} [&&]:w-full disabled:cursor-not-allowed [&&]:disabled:bg-[#f3f2f1]`}
          placeholder="Введите ваш email"
          disabled={!isEditing}
        />
        <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {hasNoEmail && !isEditing && (
        <AlertMessage
          type="warning"
          message="Рекомендуем добавить email для получения уведомлений"
        />
      )}

      {isEditing && isPhoneRegistered && (
        <AlertMessage
          type="success"
          message="Вы можете изменить email без подтверждения, так как были зарегистрированы по телефону"
        />
      )}

      {isEditing && !isPhoneRegistered && (
        <AlertMessage
          type="warning"
          message="Для смены email потребуется подтверждение на прежнем и новом адресах."
        />
      )}

      {error && <AlertMessage type="error" message={error} />}
    </div>
  );
};

export default ProfileEmail;
