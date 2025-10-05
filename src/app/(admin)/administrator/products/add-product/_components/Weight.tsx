import { formStyles } from "@/app/styles";

interface WeightProps {
  weight: string;
  onChangeAction: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Weight = ({ onChangeAction, weight }: WeightProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Вес (кг) <span className="text-[#d80000]">*</span>
      </label>
      <input
        type="number"
        name="weight"
        step="0.01"
        value={weight}
        onChange={onChangeAction}
        className={`${formStyles.input} bg-white [&&]:w-full`}
      />
    </div>
  );
};

export default Weight;
