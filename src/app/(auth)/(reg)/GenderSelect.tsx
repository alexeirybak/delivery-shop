"use client";

import { formStyles } from "./styles";

interface GenderSelectProps {
  value: string;
  onChangeAction: (gender: string) => void; // Упрощаем интерфейс
}

export default function GenderSelect({ value, onChangeAction }: GenderSelectProps) {
  const genders = [
    { id: "male", label: "Мужской" },
    { id: "female", label: "Женский" }
  ];

  return (
    <div className="text-xs w-full">
      <label className={formStyles.label}>Пол</label>
      <div className="flex gap-1 bg-[#f3f2f1] h-10 rounded p-1">
        {genders.map((gender) => (
          <label
            key={gender.id}
            className={`flex-1 rounded duration-300 cursor-pointer flex items-center justify-center ${
              value === gender.id ? "bg-(--color-primary) text-white" : ""
            }`}
          >
            <input
              type="radio"
              value={gender.id}
              checked={value === gender.id}
              onChange={() => onChangeAction(gender.id)}
              className="hidden" // Скрываем нативный radio
            />
            {gender.label}
          </label>
        ))}
      </div>
    </div>
  );
}