"use client";

import Image from "next/image";
import { ChangeEvent } from "react";
import { formStyles } from "./styles";
import { regions } from "@/data/regions";

interface SelectRegionProps {
  value: string;
  onChangeAction: (e: ChangeEvent<HTMLSelectElement>) => void;
  regions?: Array<{ value: string; label: string }>;
}

export default function SelectRegion({ value, onChangeAction }: SelectRegionProps) {
  return (
    <div>
      <label htmlFor="region" className={formStyles.label}>
        Регион
      </label>
      <div className="relative">
        <select
          id="region"
          value={value}
          onChange={onChangeAction}
          className={`${formStyles.input} appearance-none pr-8 cursor-pointer`}
        >
          {regions.map((region) => (
            <option key={region.value} value={region.value}>
              {region.label}
            </option>
          ))}
        </select>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <Image
            src="/icons-products/icon-arrow-right.svg"
            width={24}
            height={24}
            alt="Выберите регион"
            className="rotate-90"
          />
        </div>
      </div>
    </div>
  );
}