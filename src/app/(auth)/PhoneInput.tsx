"use client";
import { ChangeEvent } from "react";
import { formStyles } from "./styles";
import { InputMask } from "@react-input/mask";

interface PhoneInputProps {
  value: string;
  onChangeAction: (e: ChangeEvent<HTMLInputElement>) => void;
}

const PhoneInput = ({ value, onChangeAction }: PhoneInputProps) => {
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const fakeEvent = {
      ...e,
      target: {
        ...e.target,
        value: rawValue,
        id: 'phone'
      }
    };
    onChangeAction(fakeEvent as ChangeEvent<HTMLInputElement>);
  };

  const formatDisplayValue = (rawValue: string) => {
    if (!rawValue) return "";
    const digits = rawValue.replace(/\D/g, "");
    
    // Начинаем форматирование только если есть хотя бы 1 цифра после 7
    if (digits.length <= 1) return digits === "7" ? "+7" : digits;
    
    const match = digits.match(/^(\d{1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
    if (!match) return "";
    
    return `+7 (${match[2] ? match[2] : ''}${match[3] ? ') ' + match[3] : ''}${match[4] ? '-' + match[4] : ''}${match[5] ? '-' + match[5] : ''}`;
  };

  return (
    <div>
      <label htmlFor="phone" className={formStyles.label}>
        Телефон
      </label>
      <InputMask
        mask="+7 (___) ___-__-__"
        replacement={{ _: /\d/ }}
        id="phone"
        value={formatDisplayValue(value)}
        placeholder="+7 (___) ___-__-__"
        onChange={handlePhoneChange}
        className={formStyles.input}
        showMask={false} // Убираем отображение маски при пустом значении
      />
    </div>
  );
};

export default PhoneInput;