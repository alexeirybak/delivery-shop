"use client";

import Image from "next/image";
import { ChangeEvent } from "react";

interface CheckboxNoCardProps {
  checked: boolean;
  onChangeAction: (e: ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  label?: string;
}

export default function CheckboxCard({
  checked,
  onChangeAction,
  id = "hasCard",
  label = "У меня нет карты лояльности",
}: CheckboxNoCardProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="inline-flex items-center cursor-pointer">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChangeAction}
          className="absolute opacity-0 h-0 w-0"
        />
        <span
          className={`relative w-5 h-5 border rounded flex items-center justify-center transition-colors
            ${
              checked
                ? "bg-[#70c05b] border-[#70c05b]"
                : "bg-white border-[#bfbfbf]"
            }`}
        >
          {checked && (
            <Image
              src="/icons-auth/icon-has.svg"
              width={12}
              height={12}
              alt="Checked"
              className="text-white"
            />
          )}
        </span>
        <span className="ml-2 text-[#8f8f8f]">{label}</span>
      </label>
    </div>
  );
}
