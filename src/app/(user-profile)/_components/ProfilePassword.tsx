import { useAuthStore } from "@/store/authStore";
import { formStyles, profileStyles } from "@/app/styles";
import { Key, ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ProfilePassword = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isPhoneRegistered = user?.phoneNumberVerified === true;

  const handlePasswordChangeClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    setIsModalOpen(false);

    await logout();

    if (isPhoneRegistered) {
      router.replace("/phone-pass-reset");
    } else {
      router.replace("/forgot-password");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getModalText = () => {
    return isPhoneRegistered
      ? "Для смены пароля будет использована SMS-верификация. Вы будете выведены из аккаунта. Продолжить?"
      : "Для смены пароля будет отправлено письмо с инструкциями на Ваш email. Вы будете выведены из аккаунта. Продолжить?";
  };

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h3 className={profileStyles.sectionTitle}>Пароль</h3>

        <button
          onClick={handlePasswordChangeClick}
          className={profileStyles.editButton}
        >
          Сменить пароль
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      <div className={profileStyles.inputContainer}>
        <input
          type="text"
          value="********"
          className={`${formStyles.input} [&&]:w-full disabled:cursor-not-allowed [&&]:disabled:bg-[#f3f2f1]`}
          disabled
          readOnly
        />
        <Key className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
      </div>

      {isModalOpen && (
        <div className="absolute inset-0 z-100 flex items-center justify-center bg-[#fcd5bacc] min-h-screen text-main-text py-10 px-3 backdrop-blur-sm">
          <div className="relative bg-white rounded shadow-auth-form) max-h-[calc(100vh-80px)] w-full flex flex-col p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Подтверждение смены пароля
              </h3>
              <button
                onClick={handleCancel}
                className="p-1 text-gray-400 rounded-full cursor-pointer hover:text-gray-600 transition-custom hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="mb-6 text-gray-600">{getModalText()}</p>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className={profileStyles.cancelButton}
              >
                Отмена
              </button>
              <button
                onClick={handleConfirm}
                className={profileStyles.saveButton}
              >
                Продолжить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePassword;
