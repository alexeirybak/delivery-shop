"use client";

import { ChangeEvent } from "react";
import { formStyles } from "../../../styles";

interface EmailInputProps {
  value?: string;
  onChangeAction: (e: ChangeEvent<HTMLInputElement>) => void;
}

const EmailInput = ({ value, onChangeAction }: EmailInputProps) => {
  return (
    <div>
      <label htmlFor="email" className={formStyles.label}>
        E-mail
      </label>
      <input
        id="email"
        type="email"
        value={value}
        onChange={onChangeAction}
        className={formStyles.input}
      />
    </div>
  );
};

export default EmailInput;
