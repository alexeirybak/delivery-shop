"use client";

import Image from "next/image";
import { ChangeEvent } from "react";
import { formStyles } from "./styles";
import { cities } from "@/data/cities";

interface SelectCityProps {
  value: string;
  onChangeAction: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export default function SelectCity({ value, onChangeAction }: SelectCityProps) {
  return (
    <div className="relative">
      <label htmlFor="location" className={formStyles.label}>
        Населенный пункт
      </label>
      <div className="relative">
        <select
          id="location"
          value={value}
          onChange={onChangeAction}
          className={`${formStyles.input} appearance-none pr-8 cursor-pointer`}
        >
          {cities.map((city) => (
            <option key={city.value} value={city.value}>
              {city.label}
            </option>
          ))}
        </select>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <Image
            src="/icons-products/icon-arrow-right.svg"
            width={24}
            height={24}
            alt="Выберите город"
            className="rotate-90"
          />
        </div>
      </div>
    </div>
  );
}
