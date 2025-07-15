import Image from "next/image";
import { PriceInputsProps } from "@/types/priceInputsProps";

const PriceInputs = ({
  from,
  to,
  min,
  max,
  onFromChangeAction,
  onToChangeAction,
}: PriceInputsProps) => {
  return (
    <div className="flex flex-row items-center justify-between gap-2">
      <input
        type="number"
        name="from"
        value={from}
        onChange={(e) => onFromChangeAction(e.target.value)}
        placeholder={`${min}`}
        min={min}
        max={max}
        className="w-[124px] h-10 border border-[#bfbfbf] rounded bg-white py-2 px-4"
      />
      <Image
        src="/icons-products/icon-line.svg"
        alt="до"
        width={24}
        height={24}
      />
      <input
        type="number"
        name="to"
        value={to}
        onChange={(e) => onToChangeAction(e.target.value)}
        placeholder={`${max}`}
        min={min}
        max={max}
        className="w-[124px] h-10 border border-[#bfbfbf] rounded bg-white py-2 px-4"
      />
    </div>
  );
};

export default PriceInputs;
