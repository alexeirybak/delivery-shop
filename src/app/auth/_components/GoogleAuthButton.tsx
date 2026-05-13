"use client";

import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { useRegisterStore } from "@/store/useRegisterStore";
import { useState } from "react";
import { GoogleAuthButtonProps } from "../types/social/social.types";

export const GoogleAuthButton = ({
  isLoading,
  isGoogleLoading,
  setIsGoogleLoading,
  disabled,
  typeAuth,
  onCheckTerms,
}: GoogleAuthButtonProps) => {
  const { formData } = useRegisterStore();
  const [error, setError] = useState("");

  const handleGoogleAuth = async () => {
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
      setIsGoogleLoading(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/user-dashboard",
      });
    } catch {
      console.error("Ошибка входа через Google");
      setError("Ошибка входа через Google");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <>
      <button
        className="social-button google"
        onClick={handleGoogleAuth}
        disabled={disabled || isLoading || isGoogleLoading}
      >
        {isGoogleLoading ? (
          "Загрузка..."
        ) : (
          <>
            <Image
              src="/google.svg"
              alt="Войти через Google"
              width={36}
              height={36}
            />
            Войти с Google
          </>
        )}
      </button>
      {error && <div className="field-error social-error">{error}</div>}
    </>
  );
};