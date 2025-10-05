"use client";

import { useAuthStore } from "@/store/authStore";
import { buttonStyles } from "@/app/styles";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DeleteAccountModal from "./DeleteAccountModal";

const SecuritySection: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const logoutFromProfile = () => {
    router.push("/");
  };

  const handleAppLogout = async () => {
    try {
      await logout();
      router.replace("/");
    } catch (error) {
      console.error("Ошибка при выходе:", error);
      setError("Не удалось выйти из приложения");
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (user.phoneNumberVerified === true) {
      router.push("/verify-delete-phone");
    } else {
      router.push("/verify-delete-email");
    }
  };

  const handleOpenDeleteModal = () => {
    setError(null);
    setShowDeleteConfirm(true);
  };

  const handleCloseDeleteModal = () => {
    setError(null);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold text-main-text mb-6">Безопасность</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-[#d80000] rounded">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <button
            onClick={logoutFromProfile}
            className={`${buttonStyles.active} flex flex-1 items-center justify-center h-12 bg-[#f3f2f1] text-[#606060] px-4 py-2 rounded font-medium hover:shadow-button-cancel active:shadow-button-cancel-active duration-300 cursor-pointer`}
          >
            Выйти из личного кабинета
          </button>
          <button
            onClick={handleAppLogout}
            className="flex-1 bg-[#f3f2f1] border-none rounded flex hover:shadow-button-secondary px-4 py-2 justify-center items-center active:shadow-(--shadow-button-active) disabled:opacity-50 disabled:cursor-not-allowed h-12 text-[#606060] font-medium  duration-300 cursor-pointer"
          >
            Выйти из приложения
          </button>
          <button
            onClick={handleOpenDeleteModal}
            className="bg-[#ffc7c7] hover:bg-[#d80000] text-[#d80000] hover:text-[#f2f2f2] px-4 py-2 h-12 rounded font-medium duration-300 text-center cursor-pointer"
          >
            Удалить аккаунт
          </button>
        </div>
      </div>
      <DeleteAccountModal
        isOpen={showDeleteConfirm}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteAccount}
        error={error}
      />
    </>
  );
};

export default SecuritySection;
