import { ChangeEvent, useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { formStyles } from "@/app/(auth)/styles";
import { AlertCircle, Mail, Edit } from "lucide-react";
import { buttonStyles } from "@/app/(auth)/styles";
import { CONFIG } from "../../../../config/config";
import { authClient } from "@/lib/auth-client";
import { SuccessChangeEmail } from "./SuccessChangeEmail"; // Импортируем компонент
import { AuthFormLayout } from "@/app/(auth)/_components/AuthFormLayout";

const ProfileEmail = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const { user, fetchUserData } = useAuthStore();

  useEffect(() => {
    if (user) {
      const isTempEmail = user.email?.endsWith(CONFIG.TEMPORARY_EMAIL_DOMAIN);
      setEmail(isTempEmail ? "" : user.email || "");
    }
  }, [user]);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError("");
  };

  const isTempEmail = user?.email?.endsWith(CONFIG.TEMPORARY_EMAIL_DOMAIN);
  const hasNoEmail = !user?.email || user.email.trim() === "" || isTempEmail;
  const isPhoneRegistered = user?.phoneNumberVerified === true;

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
        const response = await fetch("/api/auth/update-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, userId: user.id }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Ошибка при обновлении email");
        }

        await fetchUserData();
        alert("Email успешно обновлен!");
        setIsEditing(false);
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

  const handleCancel = () => {
    const isTemp = user?.email?.endsWith(CONFIG.TEMPORARY_EMAIL_DOMAIN);
    setEmail(isTemp ? "" : user?.email || "");
    setIsEditing(false);
    setError("");
  };

  if (showSuccess) {
    return (
      <AuthFormLayout>
        <SuccessChangeEmail email={user?.email || ""} />
      </AuthFormLayout>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <label htmlFor="email" className={formStyles.label}>
          E-mail
        </label>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className={`${buttonStyles.active} px-4 py-2 rounded items-center justify-center font-medium duration-300 cursor-pointer flex`}
          >
            <Edit className="h-4 w-4 mr-1" />
            Редактировать
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-4 py-2 bg-[#f3f2f1] rounded hover:shadow-button-secondary active:shadow-button-active text-[#606060] duration-300 cursor-pointer"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-primary hover:shadow-button-default active:shadow-button-active rounded text-white duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSaving ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        )}
      </div>

      {hasNoEmail && !isEditing && (
        <div className="flex items-center bg-amber-50 text-amber-700 px-3 py-2 rounded-lg mb-3">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span className="text-sm">
            Рекомендуем добавить email для получения уведомлений
          </span>
        </div>
      )}

      {isEditing && isPhoneRegistered && (
        <div className="flex items-center bg-green-50 text-primary px-3 py-2 rounded-lg mb-3">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span className="text-sm">
            Вы можете изменить email без подтверждения, так как были
            зарегистрированы по телефону
          </span>
        </div>
      )}

      {isEditing && !isPhoneRegistered && (
        <div className="flex items-center bg-orange-50 text-[#ff6633] px-3 py-2 rounded-lg mb-3">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span className="text-sm">
            Для смены email потребуется подтверждение на прежнем адресе.
            Отменить эту операцию будет нельзя
          </span>
        </div>
      )}

      {error && (
        <div className="flex items-center bg-red-50 text-red-700 px-3 py-2 rounded-lg mb-3">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="relative">
        <input
          id="email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          className={`${formStyles.input} [&&]:w-full disabled:cursor-not-allowed [&&]:disabled:bg-[#f3f2f1] ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : ""
          }`}
          placeholder="Введите ваш email"
          disabled={!isEditing}
        />
        <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
};

export default ProfileEmail;
