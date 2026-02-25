import { transliterate } from "../../../../../../../../utils/transliterate";
import { TopicInputProps } from "../types/auto-generate.types";

const TopicInput = ({
  topic,
  categorySlug,
  selectedCategorySlug,
  onTopicChange,
}: TopicInputProps) => {
  const currentCategorySlug =
    selectedCategorySlug || categorySlug || "[category]";
  const slug = transliterate(topic, true);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Тема/Заголовок статьи *
      </label>
      <input
        type="text"
        value={topic}
        onChange={(e) => onTopicChange(e.target.value)}
        placeholder="Название статьи"
        className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-custom"
      />
      {topic && (
        <div className="mt-2 text-sm text-gray-600">
          <p>Будет использовано как заголовок статьи</p>
          <p>
            URL: /blog/{currentCategorySlug}/{slug}
          </p>
        </div>
      )}
    </div>
  );
};

export default TopicInput;
