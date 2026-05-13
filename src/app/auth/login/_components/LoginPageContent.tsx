"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { EmailStep } from "./EmailStep";
import { PasswordStep } from "./PasswordStep";
import { SocialAuth } from "./SocialAuth";
import "../../styles/auth.css";
import Link from "next/link";

export const LoginPageContent = () => {
  const router = useRouter();
  const { checkAuth, isAuth, user } = useAuthStore();
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isVkLoading, setIsVkLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
    termsAccepted?: string;
  }>({});
  const [formData, setFormData] = useState({ password: "" });
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      if (isAuth && user) {
        router.replace("/user-dashboard");
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) setErrors({});
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setErrors({ email: "Email обязателен" });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: "Некорректный email" });
      return false;
    }
    return true;
  };

  const checkEmailExists = async () => {
    if (!validateEmail()) return;

    setIsChecking(true);
    try {
      const response = await fetch("/api/auth/check-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: email, loginType: "email" }),
      });
      const data = await response.json();

      if (!data.exists) {
        setErrors({ email: "Пользователь с таким email не найден" });
        return;
      }

      if (!data.verified) {
        setErrors({
          general:
            "Email не подтвержден. Проверьте почту или запросите новое письмо.",
        });
        return;
      }

      setStep("password");
    } catch {
      setErrors({ general: "Ошибка проверки email" });
    } finally {
      setIsChecking(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, password: e.target.value });
    if (errors.password) setErrors({});
  };

  const validatePassword = () => {
    if (!formData.password) {
      setErrors({ password: "Пароль обязателен" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePassword()) return;

    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: email,
        password: formData.password,
      });

      if (error) {
        if (error.message?.includes("Invalid email or password")) {
          setErrors({ password: "Неверный пароль" });
        } else {
          setErrors({ general: error.message || "Ошибка входа" });
        }
        setIsLoading(false);
      } else {
        await checkAuth();
        router.push("/user-dashboard");
        setIsLoading(false);
      }
    } catch {
      setErrors({ general: "Произошла ошибка при входе" });
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setFormData({ password: "" });
    setErrors({});
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(e.target.checked);
    if (errors.termsAccepted) {
      setErrors({ ...errors, termsAccepted: undefined });
    }
  };

  return (
    <main className="register-page">
      <div className="register-glow" />

      <div className="register-container">
        <div className="register-form-wrapper">
          <p >Еще не зарегистрированы? Тогда Вам сюда:</p>
          <Link href="/auth/register" className="login-link">Регистрация</Link>
          <div className="register-form-container">
            <h2 className="form-title">Войти в аккаунт</h2>
            <p className="form-subtitle">
              {step === "email"
                ? "Введите email для входа"
                : `Введите пароль для ${email}`}
            </p>

            {errors.general && (
              <div className="form-error">{errors.general}</div>
            )}

            {step === "email" ? (
              <EmailStep
                email={email}
                onEmailChange={handleEmailChange}
                isChecking={isChecking}
                errors={errors}
                onCheckEmail={checkEmailExists}
              />
            ) : (
              <PasswordStep
                password={formData.password}
                onPasswordChange={handlePasswordChange}
                passwordError={errors.password}
                isLoading={isLoading}
                onBackToEmail={handleBackToEmail}
                onSubmit={handleSubmit}
              />
            )}

            {step === "email" && (
              <SocialAuth
                termsAccepted={termsAccepted}
                onTermsChange={handleTermsChange}
                termsError={errors.termsAccepted}
                isLoading={isLoading}
                isGoogleLoading={isGoogleLoading}
                setIsGoogleLoading={setIsGoogleLoading}
                isVkLoading={isVkLoading}
                setIsVkLoading={setIsVkLoading}
                onSetErrors={setErrors}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
