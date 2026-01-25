import { useArticleStore } from "@/store/articleStore";
import { Save, Eye, EyeOff, Star, FileText, Globe } from "lucide-react";
import { SubmitSectionProps } from "../../../categories/types";
import { useState, useEffect } from "react";
import { ArticlePreviewModal } from "./tiptap-components/ArticlePreviewModal";
import "./css/modal-preview.css";

export const ArticleSubmitSection = ({ onCancel }: SubmitSectionProps) => {
  const { updateFormField, isSubmitting, isUploading, formData } =
    useArticleStore();

  const [articleStatus, setArticleStatus] = useState<"published" | "draft">(
    formData.status === "published" || formData.status === "draft"
      ? formData.status
      : "draft",
  );
  const [isFeatured, setIsFeatured] = useState<boolean>(
    formData.isFeatured || false,
  );
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (formData.status) {
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

  const handleCancelWithConfirm = () => {
    const hasData =
      formData.name.trim() !== "" ||
      formData.slug.trim() !== "" ||
      formData.description.trim() !== "" ||
      formData.keywords.trim() !== "" ||
      formData.image.trim() !== "" ||
      formData.content?.trim() !== "" ||
      formData.categoryId !== "";

    if (hasData) {
      const confirmCancel = confirm(
        "Вы уверены, что хотите отменить создание статьи? Все введенные данные будут потеряны.",
      );

      if (confirmCancel) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  const canPreview = formData.content?.trim() !== "";

  return (
    <>
      <ArticlePreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
      <div className="mb-6 bg-linear-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-600" />
              Предпросмотр статьи
            </h3>
            <p className="text-gray-600 text-sm">
              Посмотрите, как статья будет выглядеть на сайте перед сохранением
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            disabled={!canPreview || isUploading || isSubmitting}
            className={`flex items-center justify-center gap-2 px-2 md:px-6 py-3 rounded-lg cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium whitespace-nowrap shadow-lg ${
              canPreview
                ? "bg-linear-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all"
                : "bg-gray-200 text-gray-500"
            }`}
            title={
              !canPreview
                ? "Добавьте контент статьи для предпросмотра"
                : "Открыть предпросмотр статьи"
            }
          >
            <Eye className="w-5 h-5" />
            <span>Предпросмотр статьи</span>
          </button>
        </div>

        {!canPreview && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700 text-sm">
              Для предпросмотра необходимо заполнить название и текст статьи
            </p>
          </div>
        )}
      </div>
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
                  ? "bg-yellow-50 text-yellow-700 border-yellow-300 shadow-sm"
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

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          type="submit"
          disabled={isUploading || isSubmitting}
          className={`flex items-center justify-center gap-2 px-5 py-3 rounded-lg cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex-1 ${
            articleStatus === "published"
              ? isFeatured
                ? "bg-yellow-600 text-white hover:bg-yellow-700"
                : "bg-green-600 text-white hover:bg-green-700"
              : "bg-yellow-600 text-white hover:bg-yellow-700"
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
