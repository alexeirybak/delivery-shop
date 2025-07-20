"use client";

import { InputMask } from "@react-input/mask";
import { ChangeEvent } from "react";
import { formStyles } from "./styles";

interface PhoneInputProps {
  value: string;
  onChangeAction: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function PhoneInput({ value, onChangeAction }: PhoneInputProps) {
  return (
    <div>
      <label htmlFor="phone" className={formStyles.label}>
        Телефон
      </label>
      <InputMask
        mask="+7 (___) ___-__-__"
        replacement={{ _: /\d/ }}
        id="phone"
        type="text"
        value={value}
        placeholder="+7 (___) ___-__-__"
        onChange={onChangeAction}
        className={formStyles.input}
        showMask={true}
        onFocus={(e) => {
          // Автоматически устанавливаем курсор после +7
          if (e.target.value === "+7") {
            e.target.setSelectionRange(2, 2);
          }
        }}
      />
    </div>
  );
}
