"use client";

import { useAuthStore } from "@/store/authStore";
import { Key, ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "../styles/profile-password.css";

const ProfilePassword = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasPassword = user?.hasPassword ?? false;

  if (!hasPassword) {
    return null;
  }

  const handlePasswordChangeClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    setIsModalOpen(false);
    await logout();
    router.replace("/auth/forgot-password");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="user-profile-field">
        <div className="user-profile-field-label">
          <Key className="w-4 h-4" />
          <span>Пароль</span>
        </div>

        <div className="user-profile-field-value">
          <span>********</span>
          <button
            onClick={handlePasswordChangeClick}
            className="user-profile-edit-btn"
            title="Сменить пароль"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="user-profile-modal-overlay">
          <div className="user-profile-modal">
            <div className="user-profile-modal-header">
              <h3 className="user-profile-modal-title">
                Подтверждение смены пароля
              </h3>
              <button
                onClick={handleCancel}
                className="user-profile-modal-close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="user-profile-modal-body">
              <p>
                Для смены пароля будет отправлено письмо с инструкциями на Ваш
                email. Вы будете выведены из аккаунта. Продолжить?
              </p>
            </div>

            <div className="user-profile-modal-footer">
              <button
                onClick={handleCancel}
                className="user-profile-modal-cancel"
              >
                Отмена
              </button>
              <button
                onClick={handleConfirm}
                className="user-profile-modal-confirm"
              >
                Продолжить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePassword;