"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import UserProfileHeader from "./_components/UserProfileHeader";
import SecuritySection from "./_components/SecuritySection";
import Finance from "./_components/Finance";
import BasicInfoSection from "./_components/BasicInfoSection";
import ProfessionalInfoSection from "./_components/ProfessionalInfoSection";
import YandexApiKeys from "./_components/YandexApiKeys";
import "./styles/user-profile.css";

const UserProfile = () => {
  const { user, isAuth, checkAuth, updateUser } = useAuthStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      await checkAuth();
      setIsCheckingAuth(false);
    };
    checkAuthentication();
  }, [checkAuth]);

  const handleSave = async (field: string, value: string) => {
    setMessage(null);

    try {
      const res = await fetch("/api/auth/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value || null }),
      });

      if (res.ok) {
        updateUser({ [field]: value || null });
        setMessage({ text: "Профиль обновлен", type: "success" });
        setTimeout(() => setMessage(null), 3000);
      } else {
        const error = await res.json();
        setMessage({ text: error.error || "Ошибка сохранения", type: "error" });
      }
    } catch {
      setMessage({ text: "Ошибка сети", type: "error" });
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="user-profile-loading">
        <div className="user-profile-spinner" />
      </div>
    );
  }

  if (!isAuth || !user) {
    return (
      <div className="user-profile-loading">
        <div className="user-profile-spinner" />
      </div>
    );
  }

  return (
    <main className="user-profile-page">
      <div className="user-profile-glow" />

      <div className="user-profile-container">
        <UserProfileHeader />
        {message && (
          <div
            className={`user-profile-message user-profile-message-${message.type}`}
          >
            {message.text}
          </div>
        )}

        <div className="user-profile-content">
          <BasicInfoSection user={user} onSave={handleSave} />
          <ProfessionalInfoSection user={user} onSave={handleSave} />
          <Finance />
          <YandexApiKeys />
        </div>
        <SecuritySection />
      </div>
    </main>
  );
};

export default UserProfile;