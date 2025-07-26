"use client";
import { useState, ChangeEvent } from "react";
import Image from "next/image";
import { formStyles } from "./styles";
import Tooltip from "./Tooltip";
import { validateBirthDate } from "../../../../utils/validation/date";

interface DateInputProps {
  id: string;
  value: string;
  onChangeAction: (value: string) => void;
}

export default function DateInput({
  id,
  value,
  onChangeAction,
}: DateInputProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (input: string): string => {
    const cleaned = input.replace(/\D/g, "");
    let formatted = "";
    if (cleaned.length > 0) formatted = cleaned.slice(0, 2);
    if (cleaned.length > 2) formatted += "." + cleaned.slice(2, 4);
    if (cleaned.length > 4) formatted += "." + cleaned.slice(4, 8);
    return formatted;
  };

  const handleDateChange = (formattedDate: string) => {
    const validation = validateBirthDate(formattedDate);
    setError(validation.error || null);
    setShowTooltip(!!validation.error);
    onChangeAction(formattedDate);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDate(e.target.value);
    handleDateChange(formatted);
  };

  const handleCalendarClick = () => {
    const tempInput = document.createElement("input");
    tempInput.type = "date";
    tempInput.max = new Date().toISOString().split("T")[0]; // Запрещаем выбор будущих дат

    tempInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.value) {
        const [year, month, day] = target.value.split("-");
        const formatted = `${day}.${month}.${year}`;
        handleDateChange(formatted);
      }
      document.body.removeChild(tempInput);
    };

    document.body.appendChild(tempInput);
    tempInput.showPicker();
  };

  return (
    <div className="relative">
      <label htmlFor={id} className={formStyles.label}>
        Дата рождения
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder="дд.мм.гггг"
          className={`${formStyles.input} pr-8`}
          maxLength={10}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          onClick={handleCalendarClick}
          aria-label="Выбрать дату"
        >
          <Image
            src="/icons-auth/icon-date.svg"
            width={20}
            height={20}
            alt="Календарь"
          />
        </button>
      </div>
      {showTooltip && error && <Tooltip text={error} />}
    </div>
  );
}
