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
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <h3 className={profileStyles.sectionTitle}>Пароль</h3>

        <button
          onClick={handlePasswordChangeClick}
          className={profileStyles.editButton}
        >
          Сменить пароль
          <ArrowRight className="h-4 w-4 ml-1" />
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
        <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="absolute inset-0 z-100 flex items-center justify-center bg-[#fcd5bacc] min-h-screen text-main-text py-10 px-3 backdrop-blur-sm">
          <div className="relative bg-white rounded shadow-auth-form) max-h-[calc(100vh-80px)] w-full flex flex-col p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Подтверждение смены пароля
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 duration-300 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">{getModalText()}</p>

            <div className="flex gap-3 justify-end">
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
