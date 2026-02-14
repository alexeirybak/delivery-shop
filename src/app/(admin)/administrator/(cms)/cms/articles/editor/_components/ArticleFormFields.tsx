import { RotateCcw } from "lucide-react";
import { useArticleStore } from "@/store/articleStore";
import { SEO_LIMITS } from "../../../utils/SEO_LIMITS";
import { ArticleFormFieldsProps } from "../../types/form/form-fields.types";

export const ArticleFormFields = ({
  charCount,
  onInputChange,
  onGenerateSlug,
}: ArticleFormFieldsProps) => {
  const { isSubmitting, formData } = useArticleStore();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Название статьи *
          </label>
          <span className="text-xs text-gray-500">
            {charCount.name}/{SEO_LIMITS.name.max}
          </span>
        </div>
        <input
          type="text"
          value={formData.name}
          onChange={(e) =>
            onInputChange("name", e.target.value, SEO_LIMITS.name.max)
          }
          required
          disabled={isSubmitting}
          className="w-full px-3 py-2.5 border rounded focus:outline-none focus:ring-3 duration-300
           border-gray-300 focus:border-primary focus:ring-primary/20
          disabled:opacity-50 disabled:bg-gray-100 placeholder:text-gray-400"
          placeholder="Например: Соки"
        />
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Алиас (slug) *
          </label>
          <span className="text-xs text-gray-500">
            {charCount.slug}/{SEO_LIMITS.slug.max}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => {
              const value = e.target.value.toLowerCase();
              const cleaned = value
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");

              onInputChange("slug", cleaned, SEO_LIMITS.slug.max);
            }}
            required
            disabled={isSubmitting}
            className="flex-1 px-3 py-2.5 border rounded focus:outline-none focus:ring-3 duration-300 border-gray-300 focus:border-primary focus:ring-primary/20 disabled:opacity-50 disabled:bg-gray-100 placeholder:text-gray-400"
            placeholder="soki"
          />
          <button
            type="button"
            onClick={onGenerateSlug}
            disabled={isSubmitting}
            className="flex w-full items-center gap-1 px-4 py-2.5 bg-gray-50 text-gray-700 rounded hover:bg-gray-100 text-sm whitespace-nowrap cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
            title="Сгенерировать из названия"
          >
            <RotateCcw className="w-4 h-4" />
            Генерировать
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-1">
          Только латиница, цифры и дефисы
        </p>
      </div>

      {/* Описание */}
      <div className="md:col-span-2">
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Описание (мета-описание)
          </label>
          <span className="text-xs text-gray-500">
            {charCount.description}/{SEO_LIMITS.description.max}
          </span>
        </div>
        <textarea
          value={formData.description}
          onChange={(e) =>
            onInputChange(
              "description",
              e.target.value,
              SEO_LIMITS.description.max
            )
          }
          rows={3}
          disabled={isSubmitting}
          className="w-full px-3 py-2.5 border rounded focus:outline-none focus:ring-3 duration-300 resize-none border-gray-300 focus:border-primary focus:ring-primary/20
          disabled:opacity-50 disabled:bg-gray-100 placeholder:text-gray-400"
          placeholder="Краткое описание категории для поисковых систем (10-160 символов)"
        />
      </div>

      {/* Ключевые слова */}
      <div className="md:col-span-2">
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Ключевые слова
            <span className="text-gray-500 text-xs ml-2">(через запятую)</span>
          </label>
          <span className="text-xs text-gray-500">
            {charCount.keywords}/{SEO_LIMITS.keywords.maxLength}
          </span>
        </div>
        <input
          type="text"
          value={formData.keywords}
          onChange={(e) =>
            onInputChange(
              "keywords",
              e.target.value,
              SEO_LIMITS.keywords.maxLength
            )
          }
          disabled={isSubmitting}
          className="text-xs w-full px-3 py-2.5 border rounded focus:outline-none focus:ring-3 duration-300 border-gray-300 focus:border-primary focus:ring-primary/20 disabled:opacity-50 disabled:bg-gray-100 placeholder:text-gray-400"
          placeholder="мясо, напитки, польза и вред"
        />
      </div>
    </div>
  );
};
