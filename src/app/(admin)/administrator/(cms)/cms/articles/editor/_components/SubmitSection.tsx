import { useArticleStore } from "@/store/articleStore";
import { Save, Eye, EyeOff, Star, FileText, Globe } from "lucide-react";
import { SubmitSectionProps } from "../../../categories/types";
import { useState, useEffect } from "react";

export const SubmitSection = ({ onCancel }: SubmitSectionProps) => {
  const { updateFormField, isSubmitting, isUploading, formData } =
    useArticleStore();

  const [articleStatus, setArticleStatus] = useState<"published" | "draft">(
    formData.status === "published" || formData.status === "draft"
      ? formData.status
      : "draft"
  );
  const [isFeatured, setIsFeatured] = useState<boolean>(
    formData.isFeatured || false
  );

  // Синхронизируем состояние с formData при изменении
  useEffect(() => {
    if (formData.status) {
      // Безопасное приведение типа
      const safeStatus =
        formData.status === "published" ? "published" : "draft";
      setArticleStatus(safeStatus);
    }
    if (formData.isFeatured !== undefined) {
      setIsFeatured(formData.isFeatured);
    }
  }, [formData.status, formData.isFeatured]);

  const handleStatusChange = (status: "published" | "draft") => {
    setArticleStatus(status);
    updateFormField("status", status);
  };

  const handleFeaturedChange = (featured: boolean) => {
    setIsFeatured(featured);
    updateFormField("isFeatured", featured);
  };

  // Функция с confirm перед отменой
  const handleCancelWithConfirm = () => {
    // Проверяем, есть ли введенные данные
    const hasData =
      formData.name.trim() !== "" ||
      formData.slug.trim() !== "" ||
      formData.description.trim() !== "" ||
      formData.keywords.trim() !== "" ||
      formData.image.trim() !== "" ||
      formData.content?.trim() !== "";

    if (hasData) {
      const confirmCancel = window.confirm(
        "Вы уверены, что хотите отменить создание статьи? Все введенные данные будут потеряны."
      );

      if (confirmCancel) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  return (
    <>
      {/* Секция выбора статуса избранности */}
      <div className="my-6 bg-gray-50 p-4 rounded border border-gray-200">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Star className="w-5 h-5" />
          Статус избранности
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleFeaturedChange(false)}
              disabled={isUploading || isSubmitting}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                !isFeatured
                  ? "bg-white text-gray-700 border-gray-300 shadow-sm"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <FileText className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Обычная статья</div>
                <div className="text-sm text-gray-500">
                  Стандартное отображение
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleFeaturedChange(true)}
              disabled={isUploading || isSubmitting}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                isFeatured
                  ? "bg-yellow-50 text-yellow-700 border-yellow-300 shadow-sm"
                  : "bg-white border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Star className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Избранная статья</div>
                <div className="text-sm text-gray-500">
                  Выделить особым образом
                </div>
              </div>
            </button>
          </div>

          <div className="text-sm text-gray-600 p-3 bg-white rounded border border-gray-200">
            {isFeatured ? (
              <div>
                <p className="font-medium mb-2">Избранная статья будет:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Показана на главной странице блога</li>
                  <li>Выделена в блоке &quot;Рекомендуем&quot;</li>
                  <li>Отмечена звездочкой в списках</li>
                  <li>Показывается вверху списков статей</li>
                </ul>
              </div>
            ) : (
              <div>
                <p className="font-medium mb-2">Обычная статья будет:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Отображаться в общих списках статей</li>
                  <li>Сортироваться по дате публикации</li>
                  <li>Доступна через категории и поиск</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Секция выбора статуса публикации */}
      <div className="my-6 bg-gray-50 p-4 rounded border border-gray-200">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Статус публикации
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleStatusChange("draft")}
              disabled={isUploading || isSubmitting}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                articleStatus === "draft"
                  ? "bg-blue-50 text-blue-700 border-blue-300 shadow-sm"
                  : "bg-white border-gray-300 hover:bg-gray-50"
              }`}
            >
              <EyeOff className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Черновик</div>
                <div className="text-sm text-gray-500">
                  Сохранить, но не публиковать
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleStatusChange("published")}
              disabled={isUploading || isSubmitting}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                articleStatus === "published"
                  ? "bg-green-50 text-green-700 border-green-300 shadow-sm"
                  : "bg-white border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Eye className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Опубликовать</div>
                <div className="text-sm text-gray-500">
                  Сразу опубликовать на сайте
                </div>
              </div>
            </button>
          </div>

          <div className="text-sm text-gray-600 p-3 bg-white rounded border border-gray-200">
            {articleStatus === "draft" ? (
              <div>
                <p className="font-medium mb-2">
                  Статья сохранится как черновик:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Будет видна только в административной панели</li>
                  <li>Вы сможете редактировать и опубликовать позже</li>
                  <li>Не будет доступна пользователям сайта</li>
                </ul>
              </div>
            ) : (
              <div>
                <p className="font-medium mb-2">
                  Статья будет опубликована сразу:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Сразу появится на сайте</li>
                  <li>Будет доступна всем пользователям</li>
                  <li>Попадет в ленту статей и поиск</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Кнопки отправки */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          type="submit"
          disabled={isUploading || isSubmitting}
          className={`flex items-center justify-center gap-2 px-5 py-3 rounded-lg cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex-1 ${
            articleStatus === "published"
              ? isFeatured
                ? "bg-yellow-600 text-white hover:bg-yellow-700"
                : "bg-green-600 text-white hover:bg-green-700"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <Save className="w-5 h-5" />
          <span>
            {isSubmitting
              ? "Сохранение..."
              : articleStatus === "published"
                ? isFeatured
                  ? "Опубликовать как избранную"
                  : "Опубликовать статью"
                : isFeatured
                  ? "Сохранить избранный черновик"
                  : "Сохранить черновик"}
          </span>
        </button>

        <button
          type="button"
          onClick={handleCancelWithConfirm}
          disabled={isUploading || isSubmitting}
          className="px-5 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Отмена
        </button>
      </div>
    </>
  );
};
