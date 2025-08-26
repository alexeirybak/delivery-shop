"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { MailWarning, Phone } from "lucide-react";
import { ErrorContent } from "../(reg)/_components/ErrorContent";
import ProfileHeader from "./_components/ProfileHeader";
import ProfileAvatar from "./_components/ProfileAvatar";
import SecuritySection from "./_components/SecuritySection";
import { Loader } from "@/components/Loader";
import "./styles.css";

const ProfilePage = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { user, isAuth, checkAuth } = useAuthStore();
  const router = useRouter();
  const isPhoneRegistration = user?.phoneNumberVerified;

  useEffect(() => {
    const checkAuthentication = async () => {
      await checkAuth();
      setIsCheckingAuth(false);
    };

    checkAuthentication();
  }, [checkAuth]);

  useEffect(() => {
    // Двойная проверка !isCheckingAuth && !isAuth означает: "Если проверка авторизации завершена И пользователь не авторизован → сделай редирект". Это гарантирует, что редирект произойдет только после того, как мы точно узнаем статус авторизации пользователя.
    if (!isCheckingAuth && !isAuth) {
      router.replace("/");
    }
  }, [isCheckingAuth, isAuth, router]);

  const handleToLogin = () => {
    router.replace("/login");
  };

  const handleToRegister = () => {
    router.replace("/register");
  };

  if (isCheckingAuth) {
    return <Loader />;
  }

  if (!isAuth) {
    return <Loader />;
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

                <ProfileAvatar gender={user.gender || "male"} />

                <SecuritySection />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
