import { formStyles } from "@/app/styles";

interface ArticleProps {
  article: string;
  onChangeAction: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Article = ({ onChangeAction, article }: ArticleProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Артикул <span className="text-[#d80000]">*</span>
      </label>
      <input
        type="number"
        name="article"
        min="0"
        max="999999"
        required
        value={article}
        onChange={onChangeAction}
        className={`${formStyles.input} bg-white [&&]:w-full`}
      />
    </div>
  );
};

export default Article;
