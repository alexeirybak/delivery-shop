"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRegisterStore } from "../../../../store/useRegisterStore";
import { useRegFormContext } from "@/app/contexts/RegFormContext";
import { GoogleAuthButton } from "../../_components/GoogleAuthButton";
import { VkAuthButton } from "../../_components/VkAuthButton";
import RegisterForm from "./RegisterForm";
import '../../styles/auth.css'
import Link from "next/link";

export default function RegisterPageContent() {
  const { setRegFormData } = useRegFormContext();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isVkLoading, setIsVkLoading] = useState(false);
  const router = useRouter();
  const {
    formData,
    errors,
    isLoading,
    isSubmitted,
    setField,
    validateForm,
    setSubmitted,
  } = useRegisterStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setField(
      id as keyof typeof formData,
      type === "checkbox" ? checked : value,
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    if (!validateForm()) {
      return;
    }
    setRegFormData({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      status: formData.status,
      country: formData.country,
      organization: formData.organization,
      specialization: formData.specialization,
      interests: formData.interests,
      hasPassword: true,
      termsAccepted: formData.termsAccepted,
    });

    router.push("/auth/verify-email");
  };

  return (
    <main className="register-page">
      <div className="register-glow" />
      <div className="register-container">
        <div className="register-form-wrapper">
          <p>Уже есть аккаунт? Тогда Вам сюда:</p>
          <Link href="/auth/login" className="login-link">Войти</Link>
          <div className="register-form-container">
            <h2 className="form-title">Создать аккаунт</h2>
            {errors.general && (
              <div className="form-error">{errors.general}</div>
            )}

            <RegisterForm
              formData={formData}
              errors={errors}
              isSubmitted={isSubmitted}
              isLoading={isLoading}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />

            <div className="social-register">
              <div className="flex flex-col gap-3">
                <GoogleAuthButton
                  isLoading={isLoading}
                  isGoogleLoading={isGoogleLoading}
                  setIsGoogleLoading={setIsGoogleLoading}
                  disabled={isLoading || isGoogleLoading || isVkLoading}
                  typeAuth="signUp"
                />
                <VkAuthButton
                  isLoading={isLoading}
                  isVkLoading={isVkLoading}
                  setIsVkLoading={setIsVkLoading}
                  disabled={isLoading || isGoogleLoading || isVkLoading}
                  typeAuth="signUp"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}