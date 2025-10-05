import { formStyles } from "@/app/styles";

interface BrandProps {
  brand: string;
  onChangeAction: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Brand = ({ onChangeAction, brand }: BrandProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Бренд <span className="text-[#d80000]">*</span>
      </label>
      <input
        type="text"
        name="brand"
        required
        value={brand}
        onChange={onChangeAction}
        className={`${formStyles.input} bg-white [&&]:w-full`}
      />
    </div>
  );
};

export default Brand;
