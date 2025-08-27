"use client";

import { ErrorContent } from "@/app/(auth)/(reg)/_components/ErrorContent";
import { useAuthStore } from "@/store/authStore";
import { MailWarning, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import ProfileHeader from "../_components/ProfileHeader";
import { useEffect, useState } from "react";
import { Loader } from "@/components/Loader";
import SecuritySection from "../_components/SecuritySection";
import ProfileAvatar from "./ProfileAvatar";

const ProfilePage = () => {
  const { user, isAuth, checkAuth } = useAuthStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
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
    if (!isCheckingAuth && !isAuth) {
      router.replace("/");
    }
  }, [isAuth, isCheckingAuth, router]);

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
    <div className="bg-[#fbf8ec] px-4 md:px-6 xl:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="animate-slide-in opacity translate-y-8">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden duration-700 ease-out">
            <ProfileHeader name={user.name} surname={user.surname} />

            <div className="p-6 md:p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-primary text-white px-3 py-1 rounded-full text-sm flex items-center">
                  {!isPhoneRegistration ? (
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
  );
};

export default ProfilePage;
