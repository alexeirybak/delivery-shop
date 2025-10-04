import { formStyles } from "@/app/styles";

interface BasePriceProps {
  basePrice: string;
  onChangeAction: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const BasePrice = ({ onChangeAction, basePrice }: BasePriceProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Базовая цена (руб.) <span className="text-[#d80000]">*</span>
      </label>
      <input
        type="number"
        name="basePrice"
        step="0.01"
        required
        value={basePrice}
        onChange={onChangeAction}
        className={`${formStyles.input} bg-white [&&]:w-full`}
      />
    </div>
  );
};

export default BasePrice;
