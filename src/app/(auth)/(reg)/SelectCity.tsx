"use client";

import { ChangeEvent } from "react";
import Image from "next/image";
import { formStyles } from "../styles";
import { cities } from "@/data/cities";

interface SelectCityProps {
  value: string;
  onChangeAction: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const SelectCity = ({ value, onChangeAction }: SelectCityProps) => {
  return (
    <div>
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
            <option key={city.value}>{city.label}</option>
          ))}
        </select>
        <div className="absolute right-2 top-2 transform -transform-y-1/2 pointer-events-none">
          <Image
            src="/icons-products/icon-arrow-right.svg"
            alt="Выберите населенный пункт"
            width={24}
            height={24}
            className="rotate-90"
          />
        </div>
      </div>
    </div>
  );
};

export default SelectCity;
