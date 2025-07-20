"use client";

import { ChangeEvent } from "react";
import { formStyles } from "./styles";

interface EmailInputProps {
  value: string;
  onChangeAction: (e: ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  label?: string;
  className?: string;
  placeholder?: string;
}

export default function EmailInput({
  value,
  onChangeAction,
  id = "email",
  label = "Email",
  className = "",
  placeholder = "",
}: EmailInputProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className={formStyles.label}>
        {label}
      </label>
      <input
        id={id}
        type="email"
        value={value}
        onChange={onChangeAction}
        className={formStyles.input}
        placeholder={placeholder}
      />
    </div>
  );
}
