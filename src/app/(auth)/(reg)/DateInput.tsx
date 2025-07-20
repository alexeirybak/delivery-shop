"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { formStyles } from "./styles";
import Tooltip from "./Tooltip";

interface DateInputProps {
  value: string;
  onChangeAction: (value: string) => void;
}

export default function DateInput({ value, onChangeAction }: DateInputProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatDate = (input: string): string => {
    const cleaned = input.replace(/\D/g, "");
    
    let formatted = "";
    if (cleaned.length > 0) formatted = cleaned.slice(0, 2);
    if (cleaned.length > 2) formatted += "." + cleaned.slice(2, 4);
    if (cleaned.length > 4) formatted += "." + cleaned.slice(4, 8);
    
    return formatted;
  };

  const validateDate = (dateStr: string): boolean => {
    if (!dateStr || dateStr.length < 10) {
      setError("Введите полную дату в формате дд.мм.гггг");
      setIsValid(false);
      return false;
    }

    const [day, month, year] = dateStr.split(".").map(Number);
    const date = new Date(year, month - 1, day);
    
    if (
      date.getDate() !== day ||
      date.getMonth() !== month - 1 ||
      date.getFullYear() !== year
    ) {
      setError("Некорректная дата");
      setIsValid(false);
      return false;
    }

    setError(null);
    setIsValid(true);
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDate(e.target.value);
    onChangeAction(formatted);
    validateDate(formatted);
    setShowTooltip(!!formatted && !isValid); // Показываем только если есть текст и дата невалидна
  };

  useEffect(() => {
    if (isValid) {
      setShowTooltip(false); // Автоматически скрываем тултип при валидности
    }
  }, [isValid]);

  const handleCalendarClick = () => {
    const tempInput = document.createElement("input");
    tempInput.type = "date";
    tempInput.style.position = "fixed";
    tempInput.style.opacity = "0";

    tempInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.value) {
        const [year, month, day] = target.value.split("-");
        const formatted = `${day}.${month}.${year}`;
        onChangeAction(formatted);
        validateDate(formatted);
      }
      document.body.removeChild(tempInput);
    };

    document.body.appendChild(tempInput);
    tempInput.showPicker();
  };

  return (
    <div className="relative">
      <label className={formStyles.label}>Дата рождения</label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder="дд.мм.гггг"
          className={`${formStyles.input} pr-8`}
          maxLength={10}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => !error && setShowTooltip(false)}
        />
        
        <button
          type="button"
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          onClick={handleCalendarClick}
        >
          <Image
            src="/icons-auth/icon-date.svg"
            width={20}
            height={20}
            alt="Календарь"
          />
        </button>
      </div>
      
      {showTooltip && (
        <Tooltip text={error || "Введите дату в формате дд.мм.гггг"} />
      )}
    </div>
  );
}