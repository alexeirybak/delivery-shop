"use client";

import { ChangeEvent } from "react";
import Image from "next/image";
import { formStyles } from "../../../styles";
import { regions } from "@/data/regions";

interface SelectRegionProps {
  value: string;
  onChangeAction: (e: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  disabled?: boolean;
}

const SelectRegion = ({
  value,
  onChangeAction,
  className,
  disabled,
}: SelectRegionProps) => {
  return (
    <div>
      <label htmlFor="region" className={formStyles.label}>
        Регион
      </label>
      <div className="relative">
        <select
          id="region"
          name="region"
          value={value}
          disabled={disabled}
          onChange={onChangeAction}
          className={`${formStyles.input} ${className} appearance-none pr-8 cursor-pointer disabled:cursor-not-allowed disabled:bg-[#f3f2f1]`}
        >
          {regions.map((region) => (
            <option key={region.value} value={region.label}>
              {region.label}
            </option>
          ))}
        </select>

        {!disabled && (
          <div className="absolute right-2 top-2 transform -transform-y-1/2 pointer-events-none">
            <Image
              src="/icons-products/icon-arrow-right.svg"
              alt="Выберите регион"
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

export default SelectRegion;
