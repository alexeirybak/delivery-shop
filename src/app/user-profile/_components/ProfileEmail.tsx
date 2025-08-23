"use client";

import { useState } from "react";
import { formStyles } from "@/app/(auth)/styles";
import { CONFIG } from "../../../../config/config";
import { validateEmail } from "../../../../utils/validation/emailValidation";
import Tooltip from "@/app/(auth)/_components/Tooltip";

interface ProfileEmailProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  name?: string;
  error?: string | null;
  onBlur?: () => void;
}

const ProfileEmail = ({
  value,
  onChange,
  disabled = false,
  name = "email",
  error,
  onBlur,
}: ProfileEmailProps) => {
  const [localError, setLocalError] = useState<string | null>(null);
  const isTemporaryEmail = value.endsWith(CONFIG.TEMPORARY_EMAIL_DOMAIN);
  const isEmptyEmail = value === "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalError(null);
    onChange(e);
  };

  const handleBlur = () => {
    if (value) {
      const validationError = validateEmail(value);
      setLocalError(validationError);
    }
    onBlur?.();
  };

  const displayError = error || localError;

  return (
    <div>
      <label htmlFor={name} className={formStyles.label}>
        Email
        {(isTemporaryEmail || isEmptyEmail) && (
          <span className="ml-2 text-sm text-orange-600 font-normal">
            (желательно указать email)
          </span>
        )}
      </label>
      <div className="relative">
        <input
          type="email"
          id={name}
          name={name}
          value={isTemporaryEmail ? "" : value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={
            isTemporaryEmail || isEmptyEmail ? "Введите ваш email" : undefined
          }
          className={`${formStyles.input} w-full border disabled:bg-[#f3f2f1] disabled:cursor-not-allowed duration-300 ${
            displayError ? "border-red-500" : ""
          }`}
        />

        {displayError && <Tooltip text={displayError} />}
      </div>

      {(isTemporaryEmail || isEmptyEmail) && !displayError && (
        <p className="mt-2 text-sm text-[#bfbfbf]">
          Укажите ваш email для получения уведомлений
        </p>
      )}
    </div>
  );
};

export default ProfileEmail;
