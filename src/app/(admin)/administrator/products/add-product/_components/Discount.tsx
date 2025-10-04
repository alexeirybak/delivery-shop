import { formStyles } from "@/app/styles";

interface DiscountProps {
  discount: string;
  onChangeAction: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const Discount = ({
  onChangeAction,
  discount,
  required = false,
}: DiscountProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Скидка (%) {required && <span className="text-[#d80000]">*</span>}
      </label>
      <input
        type="number"
        name="discountPercent"
        required={required}
        value={discount}
        onChange={onChangeAction}
        className={`${formStyles.input} bg-white [&&]:w-full`}
        min="0"
        max="100"
      />
    </div>
  );
};

export default Discount;
