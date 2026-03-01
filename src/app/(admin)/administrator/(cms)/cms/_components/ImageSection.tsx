import Image from "next/image";
import { AlertCircle, Upload, XCircle } from "lucide-react";
import { SEO_LIMITS } from "../utils/SEO_LIMITS";
import { useRef } from "react";
import { useCategoryStore } from "@/store/categoryStore";
import { ImageSectionProps } from "../categories/types";
import { useArticleStore } from "@/store/articleStore";
import { getImagePath } from "../../../../../../../utils/getImagePath";

export const ImageSection = ({
  type,
  errors = {},
  charCount,
  onInputChange,
  onFileChange,
  onRemoveImage,
}: ImageSectionProps) => {
  const categoryData = useCategoryStore();
  const articleData = useArticleStore();

  const storeData = type === "category" ? categoryData : articleData;
  const entityName = type === "category" ? "категории" : "статьи";

  const { editingId, isUploading, isSubmitting, formData } = storeData;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRemoveImage = () => {
    onRemoveImage();

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getImageSrc = () => {
    if (!formData.image) return "";

    if (formData.image.startsWith("blob:")) {
      return formData.image;
    }

    if (type === "category") {
      return `/uploads/blog-categories/${getImagePath(formData.image)}`;
    } else {
      return `/uploads/articles/${getImagePath(formData.image)}`;
    }
  };

  const imageSrc = getImageSrc();

  return (
    <div className="mb-6 bg-gray-50 p-4 rounded border border-gray-200">
      <h3 className="text-lg font-medium mb-4">Изображение {entityName}</h3>
      <div className="space-y-4">
        {formData.image && (
          <div className="bg-white p-4 rounded border border-gray-200">
            <div className="flex flex-col lg:flex-row items-start gap-4">
              <div className="shrink-0">
                <Image
                  src={imageSrc}
                  alt="Предпросмотр"
                  width={160}
                  height={160}
                  className="w-40 h-40 object-cover rounded shadow-sm"
                  unoptimized={formData.image.startsWith("blob:")}
                />
              </div>
              <div className="flex-1 mt-8">
                <p className="text-sm text-gray-600 mb-2">
                  {formData.image.startsWith("blob:")
                    ? `Новое изображение (будет загружено при сохранении) ${entityName}`
                    : `Текущее изображение ${entityName}`}
                </p>
                {formData.image.startsWith("blob:") && (
                  <p className="flex items-center gap-1 text-xs text-green-600 mb-2">
                    <AlertCircle className="w-3 h-3" />
                    Старое изображение будет удалено после сохранения
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isUploading || isSubmitting}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 cursor-pointer transition-custom disabled:opacity-50 disabled:cursor-not-allowed border border-red-200 hover:border-red-300"
                >
                  <XCircle className="w-4 h-4" />
                  Удалить изображение
                </button>
              </div>
            </div>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-2">
            {formData.image ? "Заменить изображение" : "Загрузить изображение"}
            <span className="text-gray-500 text-xs ml-2">
              (рекомендуется 800×450px, максимум 5MB)
            </span>
          </label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="relative cursor-pointer">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={onFileChange}
                  disabled={isUploading || isSubmitting}
                  className="hidden"
                />
                <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/20 transition-custom disabled:opacity-50 disabled:bg-gray-100 bg-white hover:bg-gray-50">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Upload className="w-4 h-4" />
                    <span>Выберите файл</span>
                  </div>
                </div>
              </label>
            </div>
            {isUploading && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent"></div>
                Обработка...
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Поддерживаемые форматы: JPG, PNG, GIF, WebP. Изображение будет
            загружено на сервер только при сохранении категории.
            {editingId &&
              formData.image &&
              formData.image.startsWith("blob:") && (
                <span className="flex items-center gap-2 text-base text-red-600 mt-1">
                  <AlertCircle className="w-5 h-5" />
                  При сохранении старое изображение будет удалено
                </span>
              )}
          </p>
        </div>
        {formData.image && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium">
                Описание изображения (ALT текст)
              </label>
              <span
                className={`text-xs ${
                  charCount.slug > SEO_LIMITS.slug.max
                    ? "text-red-600"
                    : "text-gray-500"
                }`}
              >
                {charCount.imageAlt}/{SEO_LIMITS.imageAlt.max}
              </span>
            </div>
            <input
              type="text"
              value={formData.imageAlt || ""}
              onChange={(e) =>
                onInputChange(
                  "imageAlt",
                  e.target.value,
                  SEO_LIMITS.imageAlt.max,
                )
              }
              disabled={isSubmitting}
              className={`w-full px-3 py-2.5 bg-white border rounded focus:outline-none focus:ring-3 transition-custom ${
                errors.imageAlt
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-primary focus:ring-primary/20"
              } disabled:opacity-50 disabled:bg-gray-100 placeholder:text-gray-400`}
              placeholder="Например: Соки и напитки в ассортименте"
            />
          </div>
        )}
      </div>
    </div>
  );
};
