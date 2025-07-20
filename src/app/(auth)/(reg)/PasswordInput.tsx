"use client";

import { ChangeEvent } from "react";
import { formStyles } from "./styles";
import IconVision from "@/components/svg/IconVision";
import Tooltip from "./Tooltip";

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChangeAction: (e: ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  togglePasswordVisibilityAction: () => void;
  showRequirements?: boolean;
  compareWith?: string;
}

export default function PasswordInput({
  id,
  label,
  value,
  onChangeAction,
  showPassword,
  togglePasswordVisibilityAction,
  showRequirements = false,
  compareWith,
}: PasswordInputProps) {
  const isPasswordValid = () => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(value);
  };

  const shouldShowTooltip = () => {
    if (showRequirements) {
      return value.length > 0 && !isPasswordValid();
    }
    if (compareWith) {
      return value.length > 0 && compareWith.length > 0 && value !== compareWith;
    }
    return false;
  };

  const getTooltipText = () => {
    if (showRequirements) {
      return "Пароль должен содержать: 6+ символов, буквы (A-Z, a-z) и цифры";
    }
    return "Пароли пока не совпадают";
  };

  return (
    <div className="relative">
      <label htmlFor={id} className={formStyles.label}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChangeAction}
          className={formStyles.input}
          autoComplete="off"
          onFocus={(e) => e.target.removeAttribute("readOnly")}
        />
        <button
          type="button"
          onClick={togglePasswordVisibilityAction}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <IconVision showPassword={showPassword} />
        </button>
      </div>
      {shouldShowTooltip() && <Tooltip text={getTooltipText()} />}
    </div>
  );
}