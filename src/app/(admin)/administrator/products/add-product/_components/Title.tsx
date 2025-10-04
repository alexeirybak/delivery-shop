import { formStyles } from "@/app/styles";

interface TitleProps {
  title: string;
  onChangeAction: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Title = ({ onChangeAction, title }: TitleProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Название товара <span className="text-[#d80000]">*</span>
      </label>
      <input
        type="text"
        name="title"
        required
        value={title}
        onChange={onChangeAction}
        className={`${formStyles.input} bg-white [&&]:w-full`}
      />
    </div>
  );
};

export default Title;
