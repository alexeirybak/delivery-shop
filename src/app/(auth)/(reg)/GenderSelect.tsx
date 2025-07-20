"use client";

import { formStyles } from "./styles";

interface GenderSelectProps {
  value: string;
  onChangeAction: (gender: string) => void;
}

export default function GenderSelect({ value, onChangeAction }: GenderSelectProps) {
  const genders = [
    { id: "male", label: "Мужской" },
    { id: "female", label: "Женский" }
  ];

  return (
    <div className="text-xs">
      <label className={formStyles.label}>Пол</label>
      <div className="flex gap-1 bg-[#f3f2f1] h-10 rounded p-1">
        {genders.map((gender) => (
          <button
            key={gender.id}
            type="button"
            onClick={() => onChangeAction(gender.id)}
            className={`flex-1 rounded duration-300 cursor-pointer ${
              value === gender.id ? "bg-[var(--color-primary)] text-white" : ""
            }`}
          >
            {gender.label}
          </button>
        ))}
      </div>
    </div>
  );
}