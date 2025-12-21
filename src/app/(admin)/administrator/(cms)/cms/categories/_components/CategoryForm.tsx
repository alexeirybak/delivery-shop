import Image from "next/image";
import { CategoryFormProps, FormField } from "../../types/categories";
import { SEO_LIMITS } from "../../utils/seo-limits";
import { useState } from "react";
import { 
  Loader2, 
  AlertCircle,
  Upload,
  XCircle,
  Save,
  RotateCcw
} from "lucide-react";

export const CategoryForm = ({
  formData,
  errors,
  editingId,
  isSubmitting,
  onFieldChange,
  onGenerateSlug,
  onSaveImageFile,
  onRemoveImage, 
  onSubmit,
  onCancel,
}: CategoryFormProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const charCount = {
    name: formData.name.length,
    description: formData.description.length,
    keywords: formData.keywords.length,
    imageAlt: (formData.imageAlt || "").length,
  };

  const handleInputChange = (
    field: FormField,
    value: string,
    maxLength: number
  ) => {
    if (value.length <= maxLength) {
      onFieldChange(field, value);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка типа файла
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      alert(
        "Пожалуйста, выберите изображение в формате JPG, PNG, GIF или WebP"
      );
      return;
    }

    // Проверка размера (5MB максимум)
    if (file.size > 5 * 1024 * 1024) {
      alert("Размер файла не должен превышать 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // Сохраняем файл для отложенной загрузки
      onSaveImageFile(file);
    } catch (error) {
      console.error("Ошибка при выборе изображения:", error);
      alert("Ошибка при выборе изображения");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    onRemoveImage();
  };

  return (
    <div className="mb-8 bg-white rounded shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">
        {editingId ? "Редактирование категории" : "Создание новой категории"}
      </h2>

      <form onSubmit={onSubmit}>
        {/* Секция изображения */}
        <div className="mb-6 bg-gray-50 p-4 rounded border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Изображение категории</h3>

          <div className="space-y-4">
            {/* Предпросмотр изображения */}
            {formData.image && (
              <div className="bg-white p-4 rounded border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <Image
                      src={formData.image}
                      alt="Предпросмотр"
                      width={128}
                      height={128}
                      className="w-32 h-32 object-cover rounded shadow-sm"
                      unoptimized={formData.image.startsWith('blob:')}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">
                      {formData.image.startsWith('blob:') 
                        ? "Новое изображение (будет загружено при сохранении)"
                        : "Текущее изображение категории"
                      }
                    </p>
                    {formData.image.startsWith('blob:') && (
                      <p className="flex items-center gap-1 text-xs text-green-600 mb-2">
                        <AlertCircle className="w-3 h-3" />
                        Старое изображение будет удалено после сохранения
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      disabled={isUploading || isSubmitting}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 cursor-pointer duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-red-200 hover:border-red-300"
                    >
                      <XCircle className="w-4 h-4" />
                      Удалить изображение
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Загрузка файла */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {formData.image
                  ? "Заменить изображение"
                  : "Загрузить изображение"}
                <span className="text-gray-500 text-xs ml-2">
                  (рекомендуется 800×450px, максимум 5MB)
                </span>
              </label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="relative cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={isUploading || isSubmitting}
                      className="hidden"
                    />
                    <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/20 duration-300 disabled:opacity-50 disabled:bg-gray-100 bg-white hover:bg-gray-50">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Upload className="w-4 h-4" />
                        <span>Выберите файл</span>
                      </div>
                    </div>
                  </label>
                </div>

                {isUploading && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Обработка...
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Поддерживаемые форматы: JPG, PNG, GIF, WebP. Изображение будет загружено на сервер только при сохранении категории.
                {editingId && formData.image && formData.image.startsWith('blob:') && (
                  <span className="items-center gap-1 text-red-600 block mt-1">
                    <AlertCircle className="w-3 h-3" />
                    При сохранении старое изображение будет удалено
                  </span>
                )}
              </p>
            </div>

            {/* ALT текст */}
            {formData.image && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium">
                    Описание изображения (ALT текст)
                  </label>
                  <span className="text-xs text-gray-500">
                    {charCount.imageAlt}/125
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.imageAlt || ""}
                  onChange={(e) =>
                    handleInputChange("imageAlt", e.target.value, 125)
                  }
                  disabled={isSubmitting}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 duration-300 disabled:opacity-50 disabled:bg-gray-100"
                  placeholder="Например: Соки и напитки в ассортименте"
                />
              </div>
            )}
          </div>
        </div>

        {/* Существующие поля формы */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Название */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Название категории *
              </label>
              <span
                className={`text-xs ${
                  charCount.name > SEO_LIMITS.name.max
                    ? "text-red-600"
                    : "text-gray-500"
                }`}
              >
                {charCount.name}/{SEO_LIMITS.name.max}
              </span>
            </div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                handleInputChange("name", e.target.value, SEO_LIMITS.name.max)
              }
              required
              disabled={isSubmitting}
              className={`w-full px-3 py-2.5 border rounded focus:outline-none focus:ring-3 duration-300 ${
                errors.name 
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100" 
                  : "border-gray-300 focus:border-primary focus:ring-primary/20"
              } disabled:opacity-50 disabled:bg-gray-100 placeholder:text-gray-400`}
              placeholder="Например: Соки"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Алиас (slug) *
              </label>
              <span
                className={`text-xs ${
                  formData.slug.length > SEO_LIMITS.slug.max
                    ? "text-red-600"
                    : "text-gray-500"
                }`}
              >
                {formData.slug.length}/{SEO_LIMITS.slug.max}
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase();
                  const cleaned = value
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "");
                  handleInputChange("slug", cleaned, SEO_LIMITS.slug.max);
                }}
                required
                disabled={isSubmitting}
                className={`flex-1 px-3 py-2.5 border rounded focus:outline-none focus:ring-3 duration-300 ${
                  errors.slug 
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100" 
                    : "border-gray-300 focus:border-primary focus:ring-primary/20"
                } disabled:opacity-50 disabled:bg-gray-100 placeholder:text-gray-400`}
                placeholder="soki"
              />
              <button
                type="button"
                onClick={onGenerateSlug}
                disabled={isSubmitting}
                className="flex items-center gap-1 px-4 py-2.5 bg-gray-50 text-gray-700 rounded hover:bg-gray-100 text-sm whitespace-nowrap cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
                title="Сгенерировать из названия"
              >
                <RotateCcw className="w-4 h-4" />
                Генерировать
              </button>
            </div>
            {errors.slug ? (
              <p className="text-red-500 text-xs mt-1">{errors.slug}</p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                Только латиница, цифры и дефисы
              </p>
            )}
          </div>

          {/* Описание */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Описание (мета-описание)
              </label>
              <span
                className={`text-xs ${
                  charCount.description > SEO_LIMITS.description.max
                    ? "text-red-600"
                    : charCount.description < SEO_LIMITS.description.min &&
                        charCount.description > 0
                      ? "text-yellow-600"
                      : "text-gray-500"
                }`}
              >
                {charCount.description}/{SEO_LIMITS.description.max}
              </span>
            </div>
            <textarea
              value={formData.description}
              onChange={(e) =>
                handleInputChange(
                  "description",
                  e.target.value,
                  SEO_LIMITS.description.max
                )
              }
              rows={3}
              disabled={isSubmitting}
              className={`w-full px-3 py-2.5 border rounded focus:outline-none focus:ring-3 duration-300 resize-none ${
                errors.description 
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100" 
                  : "border-gray-300 focus:border-primary focus:ring-primary/20"
              } disabled:opacity-50 disabled:bg-gray-100 placeholder:text-gray-400`}
              placeholder="Краткое описание категории для поисковых систем (10-160 символов)"
            />
            {errors.description ? (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                Оптимальная длина для SEO: {SEO_LIMITS.description.min}-
                {SEO_LIMITS.description.max} символов
              </p>
            )}
          </div>

          {/* Ключевые слова */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Ключевые слова
                <span className="text-gray-500 text-xs ml-2">
                  (через запятую)
                </span>
              </label>
              <span
                className={`text-xs ${
                  charCount.keywords > SEO_LIMITS.keywords.maxLength
                    ? "text-red-600"
                    : "text-gray-500"
                }`}
              >
                {charCount.keywords}/{SEO_LIMITS.keywords.maxLength}
              </span>
            </div>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) =>
                handleInputChange(
                  "keywords",
                  e.target.value,
                  SEO_LIMITS.keywords.maxLength
                )
              }
              disabled={isSubmitting}
              className={`w-full px-3 py-2.5 border rounded focus:outline-none focus:ring-3 duration-300 ${
                errors.keywords 
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100" 
                  : "border-gray-300 focus:border-primary focus:ring-primary/20"
              } disabled:opacity-50 disabled:bg-gray-100 placeholder:text-gray-400`}
              placeholder="мясо, напитки, польза и вред"
            />
            {errors.keywords && (
              <p className="text-red-500 text-xs mt-1">{errors.keywords}</p>
            )}
          </div>
        </div>

        {/* Индикатор загрузки */}
        {isSubmitting && (
          <div className="mt-4 p-3 bg-blue-50 text-blue-600 rounded text-sm border border-blue-100">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {editingId ? "Обновляем категорию..." : "Создаем категорию..."}
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            disabled={isUploading || isSubmitting}
            className="flex items-center gap-1 px-4 py-2.5 bg-primary text-white rounded hover:bg-primary/90 cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium focus:outline-none focus:ring-3 focus:ring-primary/30"
          >
            <Save className="w-4 h-4" />
            {isSubmitting
              ? "Сохранение..."
              : editingId
                ? "Сохранить изменения"
                : "Создать категорию"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isUploading || isSubmitting}
            className="px-4 py-2.5 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium focus:outline-none focus:ring-3 focus:ring-gray-200"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};