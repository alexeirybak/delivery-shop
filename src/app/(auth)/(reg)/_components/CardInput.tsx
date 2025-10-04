"use client";

import { InputMask } from "@react-input/mask";
import { ChangeEvent } from "react";
import { formStyles } from "../../../styles";

interface CardInputProps {
  value?: string;
  onChangeAction: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

const CardInput = ({ value, onChangeAction, disabled }: CardInputProps) => {
  return (
    <div className="flex flex-col mb-4">
      <label htmlFor="card">{"Номер карты лояльности"}</label>
      <InputMask
        mask="____ ____ ____ ____"
        replacement={{ _: /\d/ }}
        id="card"
        value={value}
        onChange={onChangeAction}
        disabled={disabled}
        placeholder={disabled ? "" : "0000 0000 0000 0000"}
        className={`${formStyles.input} ${
          disabled ? "bg-[#f3f2f1] cursor-not-allowed" : ""
        }`}
      />
    </div>
  );
};

export default CardInput;
