"use client";

import { ChangeEvent } from "react";
import Image from "next/image";
import { formStyles } from "../../styles";
import { cities } from "@/data/cities";

interface SelectCityProps {
  value: string;
  onChangeAction: (e: ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  className?: string;
}

const SelectCity = ({
  value,
  onChangeAction,
  disabled = false,
  className = "",
}: SelectCityProps) => {
  return (
    <div>
      <label htmlFor="location" className={formStyles.label}>
        Населенный пункт
      </label>
      <div className="relative">
        <select
          id="location"
          name="location" // Добавляем name для корректной работы с формами
          value={value}
          onChange={onChangeAction}
          disabled={disabled}
          className={`${formStyles.input} ${className} appearance-none pr-8 cursor-pointer disabled:cursor-not-allowed disabled:bg-[#f3f2f1]`}
        >
          {cities.map((city) => (
            <option key={city.value} value={city.label}> 
              {city.label}
            </option>
          ))}
        </select>
        {!disabled && ( 
          <div className="absolute right-2 top-2 transform -transform-y-1/2 pointer-events-none">
            <Image
              src="/icons-products/icon-arrow-right.svg"
              alt="Выберите населенный пункт"
              width={24}
              height={24}
              className="rotate-90"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectCity;