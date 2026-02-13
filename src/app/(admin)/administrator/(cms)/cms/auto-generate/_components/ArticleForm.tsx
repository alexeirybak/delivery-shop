import TopicInput from "./TopicInput";
import CategorySelect from "./CategorySelect";
import GenerateParameters from "./GenerateParameters";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";
import GenerateButton from "./GenerateButton";
import { ArticleFormProps } from "../types/auto-generate.types";

const ArticleForm = ({
  topic,
  categories,
  selectedCategoryId,
  selectedCategorySlug,
  categorySlug,
  isCategoryOpen,
  isGenerating,
  error,
  success,
  onTopicChange,
  onCategorySelect,
  onToggleCategoryOpen,
  onGenerate,
}: ArticleFormProps) => {
  const isDisabled =
    isGenerating || !topic.trim() || !selectedCategoryId;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Параметры статьи
      </h2>

      <div className="space-y-6">
        <TopicInput
          topic={topic}
          categorySlug={categorySlug}
          selectedCategorySlug={selectedCategorySlug}
          onTopicChange={onTopicChange}
        />

        <CategorySelect
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          isOpen={isCategoryOpen}
          onCategorySelect={onCategorySelect}
          onToggleOpen={onToggleCategoryOpen}
        />

        <GenerateParameters />

        {error && <ErrorMessage error={error} />}
        {success && <SuccessMessage success={success} />}

        <GenerateButton
          isGenerating={isGenerating}
          disabled={isDisabled}
          onClick={onGenerate}
        />
      </div>
    </div>
  );
};

export default ArticleForm;
