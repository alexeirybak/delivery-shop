"use client";

import { InputMask } from "@react-input/mask";
import { ChangeEvent } from "react";
import { formStyles } from "../../styles";
import Tooltip from "../../_components/Tooltip";

interface CardInputProps {
  value?: string;
  onChangeAction: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  className?: string;
  error?: string | null;
}

const CardInput = ({
  value,
  onChangeAction,
  disabled,
  className = "",
  error,
}: CardInputProps) => {
  return (
    <div className="flex flex-col mb-4 relative">
      <label htmlFor="card" className={formStyles.label}>{"Номер карты лояльности"}</label>
      <InputMask
        mask="____ ____ ____ ____"
        replacement={{ _: /\d/ }}
        id="card"
        name="card"
        value={value}
        onChange={onChangeAction}
        disabled={disabled}
        placeholder={disabled ? "" : "0000 0000 0000 0000"}
        className={`${formStyles.input} ${className} ${
          disabled ? "bg-[#f3f2f1] cursor-not-allowed" : ""
        }`}
      />
      {error && <Tooltip text={error} position="top"/>}
    </div>
  );
};

export default CardInput;
