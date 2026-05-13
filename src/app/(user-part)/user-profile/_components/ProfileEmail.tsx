import { useAuthStore } from "@/store/authStore";
import {
  Edit2,
  Info,
  Mail,
  Save,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import EmailInfo from "./EmailInfo";
import { authClient } from "@/lib/auth-client";

const ProfileEmail = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: string } | null>(
    null,
  );

  const isVkEmail = user?.email?.endsWith("@vk.com") ?? false;

  useEffect(() => {
    if (user) {
      setEmailValue(user.email || "");
    }
  }, [user]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = async () => {
    if (!user) return;

    if (!validateEmail(emailValue)) {
      setMessage({
        text: "Пожалуйста, введите корректный email адрес",
        type: "error",
      });
      return;
    }

    if (emailValue === user.email) {
      setMessage({ text: "Новый email совпадает с текущим", type: "error" });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const response = await authClient.changeEmail({
        newEmail: emailValue,
        callbackURL: "/user-profile",
      });

      if (response.error) {
        if (response.error.code === "COULDNT_UPDATE_YOUR_EMAIL") {
          throw new Error("Этот email уже используется другим пользователем");
        } else {
          throw new Error(response.error.message || "Ошибка при смене email");
        }
      }

      setMessage({
        text: `На email ${emailValue} отправлено письмо с подтверждением. Пожалуйста, перейдите по ссылке в письме для смены email. Иначе email не будет изменён.`,
        type: "success",
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Ошибка при сохранении:", error);

      if (error instanceof Error) {
        setMessage({ text: error.message, type: "error" });
      } else {
        setMessage({ text: "Произошла ошибка при смене email", type: "error" });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEmailValue(user?.email || "");
    setIsEditing(false);
    setMessage(null);
  };

  const handleCloseMessage = () => {
    setMessage(null);
  };

  return (
    <>
      <div className="user-profile-field">
        <div className="user-profile-field-label">
          <Mail className="w-4 h-4" />
          <span>Email</span>
          {!user?.emailVerified && (
            <span className="user-profile-badge-unverified">
              Не подтвержден
            </span>
          )}
          {isVkEmail && !user?.emailVerified && (
            <span className="user-profile-badge-vk">
              <Info className="w-3 h-3" />
              Технический email от VK
            </span>
          )}
        </div>

        {isEditing ? (
          <div className="user-profile-field-edit">
            <input
              type="email"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              className="user-profile-input"
              placeholder="Введите Ваш email"
              autoFocus
            />
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="user-profile-save-btn"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancel}
              className="user-profile-cancel-btn"
              disabled={isSaving}
            >
              Отмена
            </button>
          </div>
        ) : (
          <div className="user-profile-field-value">
            <span>{user?.email || "Не указан"}</span>
            <button
              onClick={() => setIsEditing(true)}
              className="user-profile-edit-btn"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {message && (
          <div
            className={`user-profile-message user-profile-message-${message.type} mt-2 flex items-center justify-between gap-2`}
          >
            <div className="flex items-center gap-2">
              {message.type === "success" ? (
                <CheckCircle className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
            <button
              onClick={handleCloseMessage}
              className="shrink-0 hover:opacity-70 transition-opacity cursor-pointer"
              aria-label="Закрыть сообщение"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {!user?.emailVerified && (
          <div className="flex items-center gap-1 text-xs text-yellow-600 mt-1">
            <AlertCircle className="w-3 h-3" />
            <span>
              {isEditing
                ? "После смены email вам потребуется подтвердить новый адрес"
                : "Email не подтвержден. Проверьте почту для подтверждения."}
            </span>
          </div>
        )}
      </div>

      {isVkEmail && !user?.emailVerified && <EmailInfo />}
    </>
  );
};

export default ProfileEmail;
