"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { LoadingContent } from "@/app/(auth)/(reg)/_components/LoadingContent";
import { MailWarning, Phone } from "lucide-react";
import { ErrorContent } from "../(reg)/_components/ErrorContent";
import DeleteAccountModal from "./_components/DeleteAccountModal";
import ProfileHeader from "./_components/ProfileHeader";
import ProfileAvatar from "./_components/ProfileAvatar";
import SecuritySection from "./_components/SecuritySection";
import ErrorComponent from "@/components/ErrorComponent";
import "./styles.css";
import { Loader } from "@/components/Loader";

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { user, isAuth, logout } = useAuthStore();
  const router = useRouter();
  const isPhoneRegistration = user?.isPhoneRegistration;

  // Handlers
  const handleToLogin = () => {
    router.replace("/login");
  };

  const handleToRegister = () => {
    router.replace("/register");
  };

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  if (isLoading) {
    return <Loader />;
  }

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok) {
        logout();
        router.replace("/");
      } else {
        throw new Error("Failed to delete account");
      }
    } catch (error) {
      console.error("Ошибка при удалении аккаунта:", error);
      setError({
        error: error as Error,
        userMessage: "Не удалось удалить аккаунт. Попробуйте позже.",
      });
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!isAuth) {
    return <LoadingContent title="Перенаправление на страницу входа" />;
  }

  if (!user) {
    return (
      <ErrorContent
        error="Данные пользователя не найдены"
        icon={<MailWarning className="h-8 w-8 text-red-600" />}
        primaryAction={{ label: "Войти", onClick: handleToLogin }}
        secondaryAction={{
          label: "Зарегистрироваться",
          onClick: handleToRegister,
        }}
      />
    );
  }

  if (error) {
    return (
      <ErrorComponent error={error.error} userMessage={error.userMessage} />
    );
  }

  return (
    <>
      <div className="bg-[#fbf8ec] px-4 md:px-6 xl:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-slide-in opacity-0 translate-y-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden duration-700 ease-out">
              <ProfileHeader name={user.name} surname={user.surname} />

              <div className="p-6 md:p-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-primary text-white px-3 py-1 rounded-full text-sm flex items-center">
                    {isPhoneRegistration ? (
                      <>
                        <Phone className="h-4 w-4 mr-1" />
                        <span>Зарегистрирован по телефону</span>
                      </>
                    ) : (
                      <>
                        <MailWarning className="h-4 w-4 mr-1" />
                        <span>Зарегистрирован по email</span>
                      </>
                    )}
                  </div>
                </div>

                <ProfileAvatar
                  gender={user.gender || "male"}
                  avatar={user.avatar}
                />

                <SecuritySection
                  onLogout={handleLogout}
                  onDeleteAccount={() => setShowDeleteConfirm(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAccount}
      />
    </>
  );
};

export default ProfilePage;
