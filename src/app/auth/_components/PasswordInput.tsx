"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Tooltip } from "./Tooltip";
import { PasswordInputProps } from "../types";

export const PasswordInput = ({
  id,
  label,
  value,
  onChange,
  error,
  isSubmitted,
  autoComplete = "new-password",
  placeholder = "Пароль",
  showStrength = false,
  compareWith,
  tooltipMessage,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const shouldShowTooltip =
    id === "confirmPassword" &&
    tooltipMessage !== undefined &&
    value.length > 0 &&
    compareWith !== undefined &&
    compareWith.length > 0 &&
    value !== compareWith;

  const getPasswordStrength = () => {
    if (!value || !showStrength) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isLongEnough = value.length >= 8;

    const strength = [
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isLongEnough,
    ].filter(Boolean).length;

    if (strength <= 2) return { text: "Слабый", color: "#ff4d4d" };
    if (strength <= 4) return { text: "Средний", color: "#ffa500" };
    return { text: "Сильный", color: "#4caf50" };
  };

  const strength = getPasswordStrength();

  return (
    <div className="form-group required">
      <label htmlFor={id}>
        <Lock className="w-4 h-4" />
        <span>{label}</span>
      </label>
      <div className="password-input-wrapper">
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`form-input ${error && isSubmitted ? "error" : ""}`}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={togglePasswordVisibility}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>

        {shouldShowTooltip && (
          <Tooltip message={tooltipMessage!} isVisible={true} position="top" />
        )}
      </div>

      {strength && showStrength && (
        <div className="password-strength">
          <span style={{ color: strength.color }}>{strength.text}</span>
        </div>
      )}

      {error && isSubmitted && <div className="field-error">{error}</div>}
    </div>
  );
};
