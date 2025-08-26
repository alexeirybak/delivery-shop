"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { buttonStyles } from "../../styles";
import DeleteAccountModal from "./DeleteAccountModal";
import { Loader } from "@/components/Loader";

const SecuritySection: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
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

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/auth/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Не удалось удалить аккаунт");
      }

      logout(); // Это очистит Zustand store
      router.replace("/goodbye"); // Редирект на страницу прощания
    } catch (error) {
      console.error("Ошибка при удалении аккаунта:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Не удалось удалить аккаунт. Попробуйте позже."
      );
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleOpenDeleteModal = () => {
    setShowDeleteConfirm(true);
    setError(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteConfirm(false);
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold text-[#414141] mb-6">Безопасность</h2>
        <div className="flex justify-center items-center h-20">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold text-[#414141] mb-6">Безопасность</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-[#d80000] rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
