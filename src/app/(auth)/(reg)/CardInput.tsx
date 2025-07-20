"use client";

import { InputMask } from "@react-input/mask";
import { ChangeEvent } from "react";
import { formStyles } from "./styles";

interface CardInputProps {
  value: string;
  onChangeAction: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  id?: string;
  label?: string;
  mask?: string;
  className?: string;
  placeholder?: string;
}

export default function CardInput({
  value,
  onChangeAction,
  disabled,
  id = "card",
  mask = "____ ____ ____ ____",
}: CardInputProps) {
  return (
    <div className={`flex flex-col mb-4`}>
      <label htmlFor={id} className={formStyles.label}>
        {"Номер карты лояльности"}
      </label>
      <InputMask
        mask={mask}
        replacement={{ _: /\d/ }}
        id={id}
        value={value}
        onChange={onChangeAction}
        disabled={disabled}
        placeholder="0000 0000 0000 0000"
        className={`${formStyles.input} ${
          disabled ? "bg-[#f3f2f1] cursor-not-allowed" : ""
        }`}
      />
    </div>
  );
}
