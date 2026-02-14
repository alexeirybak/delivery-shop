import { ArticleFormProps } from "../types/auto-generate.types";
import CategorySelect from "./CategorySelect";
import ErrorMessage from "./ErrorMessage";
import GenerateButton from "./GenerateButton";
import SuccessMessage from "./SuccessMessage";
import TopicInput from "./TopicInput";

const ArticleForm = ({
  topic,
  categorySlug,
  isCategoryOpen,
  isGenerating,
  error,
  success,
  selectedCategoryId,
  selectedCategorySlug,
  onTopicChange,
  onCategorySelect,
  onToggleCategoryOpen,
  onGenerate
}: ArticleFormProps) => {
  const isDisabled = isGenerating || !topic.trim() || !selectedCategoryId;
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
          selectedCategoryId={selectedCategoryId}
          isOpen={isCategoryOpen}
          onCategorySelect={onCategorySelect}
          onToggleOpen={onToggleCategoryOpen}
        />
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
