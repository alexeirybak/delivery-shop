"use client";

import IconVision from "@/components/svg/IconVision";
import { formStyles } from "./styles";
import { ChangeEvent } from "react";
import Tooltip from "./(reg)/Tooltip";

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

const PasswordInput = ({
  id,
  label,
  value,
  onChangeAction,
  togglePasswordVisibilityAction,
  showPassword,
  showRequirements,
  compareWith,
}: PasswordInputProps) => {
  const isPasswordValid = () => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(value);
  };

  const shouldShowTooltip = () => {
    if (showRequirements) {
      return value.length > 0 && !isPasswordValid();
    }

    if (compareWith) {
      return (
        value.length > 0 && compareWith.length > 0 && value !== compareWith
      );
    }
    return false;
  };

  const getTooltipText = () => {
    if (showRequirements) {
      return "Пароль должен содержать: 6+ символов на латинице и цифры";
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
          readOnly
          onFocus={(e) => e.target.removeAttribute("readonly")}
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
};

export default PasswordInput;
