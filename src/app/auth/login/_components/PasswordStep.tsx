"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PasswordInput } from "../../_components/PasswordInput";
import { PasswordStepProps } from "../../types";

export const PasswordStep = ({
  password,
  onPasswordChange,
  passwordError,
  isLoading,
  onBackToEmail,
  onSubmit,
}: PasswordStepProps) => {
  return (
    <form className="register-form" onSubmit={onSubmit}>
      <PasswordInput
        id="password"
        label="Пароль"
        value={password}
        onChange={onPasswordChange}
        error={passwordError}
        isSubmitted={true}
        autoComplete="current-password"
      />

      <div className="login-links">
        <button
          type="button"
          onClick={onBackToEmail}
          className="login-back-link"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Другой email</span>
        </button>
        <Link href="/auth/forgot-password" className="login-forgot-link">
          Забыли пароль?
        </Link>
      </div>

      <button type="submit" className="register-button" disabled={isLoading}>
        {isLoading ? "Вход..." : "Войти"}
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
};
