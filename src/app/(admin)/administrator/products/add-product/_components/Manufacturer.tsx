import { formStyles } from "@/app/styles";

interface ManufacturerProps {
  manufacturer: string;
  onChangeAction: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Manufacturer = ({ onChangeAction, manufacturer }: ManufacturerProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Производитель <span className="text-[#d80000]">*</span>
      </label>
      <input
        type="text"
        name="manufacturer"
        required
        value={manufacturer}
        onChange={onChangeAction}
        className={`${formStyles.input} bg-white [&&]:w-full`}
      />
    </div>
  );
};

export default Manufacturer;
