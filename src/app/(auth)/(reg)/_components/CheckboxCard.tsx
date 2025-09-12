"use client";

import { ChangeEvent } from "react";
import Image from "next/image";

interface CheckboxNoCardProps {
  checked: boolean | undefined;
  onChangeAction: (e: ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxCard = ({ checked, onChangeAction }: CheckboxNoCardProps) => {
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="hasCard"
        className="inline-flex items-center cursor-pointer"
      >
        <input
          type="checkbox"
          id="hasCard"
          checked={checked}
          onChange={onChangeAction}
          className="absolute opacity-0 h-0 w-0"
        />
        <span
          className={`relative w-5 h-5 border rounded flex items-center justify-center duration-300 ${
            checked ? "bg-primary border-primary" : "bg-white border-[#bfbfbf]"
          }`}
        >
          {checked && (
            <Image
              src="/icons-auth/icon-has.svg"
              alt={checked ? "Нет карты лояльности" : "Есть карта лояльности"}
              width={12}
              height={12}
              className="text-white"
            />
          )}
        </span>
        <span className="ml-2 text-[#8f8f8f]">
          {"У меня нет карты лояльности"}
        </span>
      </label>
    </div>
  );
};

export default CheckboxCard;
