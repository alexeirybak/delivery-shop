"use client";

import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { useRegisterStore } from "@/store/useRegisterStore";
import { useState } from "react";
import { VkAuthButtonProps } from "../types/social/social.types";

export const VkAuthButton = ({
  isLoading,
  isVkLoading,
  setIsVkLoading,
  disabled,
  typeAuth,
  onCheckTerms,
}: VkAuthButtonProps) => {
  const { formData } = useRegisterStore();
  const [error, setError] = useState("");

  const handleVkAuth = async () => {
    if (typeAuth === "signUp" && !formData.termsAccepted) {
      setError(
        "Необходимо принять условия использования и политику конфиденциальности",
      );
      return;
    }

    if (typeAuth === "signIn" && onCheckTerms && !onCheckTerms()) {
      return;
    }

    setError("");
    try {
      setIsVkLoading(true);
      await authClient.signIn.social({
        provider: "vk",
        callbackURL: "/user-dashboard",
      });
    } catch {
      console.error("Ошибка входа через VK");
      setError("Ошибка входа через VK");
    } finally {
      setIsVkLoading(false);
    }
  };

  return (
    <>
      <button
        className="social-button vk"
        onClick={handleVkAuth}
        disabled={disabled || isLoading || isVkLoading}
      >
        {isVkLoading ? (
          "Загрузка..."
        ) : (
          <>
            <Image
              src="/vk.svg"
              alt="Войти через ВКонтакте"
              width={36}
              height={36}
            />
            Войти через ВКонтакте
          </>
        )}
      </button>
      {error && <div className="field-error social-error">{error}</div>}
    </>
  );
};