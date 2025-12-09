"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import TipTapEditor from "./_components/TipTapEditor";
import { CONFIG_BLOG } from "../config-blog";
import { createSlug } from "../utils/createSlug";
import { useAuthStore } from "@/store/authStore";
import { getStatusText } from "../utils/getStatusText";
import { ArticleStatus } from "../types/articleStatus";
import { getStatusColor } from "../utils/getStatusColor";
import { Loader2 } from "lucide-react";

export default function EditorPage() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  // const [articleCategory, setArticleCategory] = useState("Без категории");
  // const [keyWords, setKeyWords] = useState("");
  const [status, setStatus] = useState<ArticleStatus>("published");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (title.trim() && !isSlugManuallyEdited) {
      const newSlug = createSlug(title);
      setSlug(newSlug);
    }
  }, [title, isSlugManuallyEdited]);

  const handleTitleChange = (value: string) => {
    if (value.length <= CONFIG_BLOG.TITLE_MAX_LENGTH) {
      setTitle(value);
      setTitleError(false);
      setSaveError(null);
    }
  };

  const handleSlugChange = (value: string) => {
    setIsSlugManuallyEdited(true); // Пользователь начал редактировать вручную

    const cleanedValue = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "")
      .slice(0, CONFIG_BLOG.SLUG_MAX_LENGTH);

    setSlug(cleanedValue);
  };

  const handleDescriptionChange = (value: string) => {
    if (value.length <= CONFIG_BLOG.DESCRIPTION_MAX_LENGTH) {
      setDescription(value);
    }
  };

  const handleStatusChange = (value: ArticleStatus) => {
    setStatus(value);
  };

  const handleSave = async () => {
    setSaveError(null);

    if (!title.trim()) {
      setSaveError("Заголовок обязателен для заполнения");
      setTitleError(true);
      return;
    }

    if (!slug.trim()) {
      setSaveError("Алиас обязателен для заполнения");
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch("/administrator/blog/api/posts/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          description: description.trim(),
          content: content,
          status: status,
          authorName: user?.name,
          keyWords: [],
          // category: articleCategory || "Без категории",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ошибка при сохранении статьи");
      }

      alert(`Статья успешно сохранена со статусом: ${getStatusText(status)}!`);

      setTitle("");
      setSlug("");
      setDescription("");
      setContent("");
      setStatus("draft");
      setTitleError(false);
      setIsSlugManuallyEdited(false);
    } catch (error: unknown) {
      console.error("Ошибка:", error);

      let errorMessage = "Ошибка при сохранении статьи";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      setSaveError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handleGenerateSlug = () => {
    if (title.trim()) {
      const newSlug = createSlug(title);
      setSlug(newSlug);
      setIsSlugManuallyEdited(true);
      setTitleError(false);
    } else {
      setTitleError(true);
    }
  };

  const canSave = title.trim().length > 0 && slug.trim().length > 0;

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-2">Редактор статей</h1>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Заголовок статьи *
            </label>
            <span
              className={`text-sm ${titleError ? "text-red-500" : "text-gray-500"}`}
            >
              {title.length}/{CONFIG_BLOG.TITLE_MAX_LENGTH}
            </span>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className={`w-full px-4 py-3 border rounded focus:ring-2 focus:outline-none transition ${
              titleError
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-primary focus:border-primary"
            }`}
            placeholder="Введите заголовок..."
          />
          {titleError && (
            <p className="mt-2 text-sm text-red-600">
              Заголовок обязателен для заполнения
            </p>
          )}
        </div>

        {/* Алиас (slug) */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Алиас (URL) *
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {slug.length}/{CONFIG_BLOG.SLUG_MAX_LENGTH}
              </span>
              <button
                type="button"
                onClick={handleGenerateSlug}
                className="text-sm text-primary hover:text-primary/80 cursor-pointer"
                title="Сгенерировать алиас из заголовка"
              >
                Сгенерировать
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">/blog/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
              placeholder="article-url"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Только латинские буквы, цифры и дефисы. Используется в URL статьи.
          </p>
        </div>

        {/* Описание */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Описание
            </label>
            <span className="text-sm text-gray-500">
              {description.length}/{CONFIG_BLOG.DESCRIPTION_MAX_LENGTH}
            </span>
          </div>
          <textarea
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary outline-none transition resize-none"
          />
          <p className="mt-1 text-sm text-gray-500">
            Рекомендуется {CONFIG_BLOG.DESCRIPTION_MAX_LENGTH} символов для
            лучшего отображения в поисковых системах.
          </p>
        </div>

        {/* Статус статьи */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Статус статьи *
          </label>
          <div className="flex flex-wrap gap-2">
            {(
              ["published", "draft", "archived", "deleted"] as ArticleStatus[]
            ).map((statusOption) => (
              <button
                key={statusOption}
                type="button"
                onClick={() => handleStatusChange(statusOption)}
                className={`px-4 py-2 rounded border duration-300 cursor-pointer ${
                  status === statusOption
                    ? getStatusColor(statusOption) + " font-semibold"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {getStatusText(statusOption)}
              </button>
            ))}
          </div>
          <div className={`mt-3 p-3 rounded border ${getStatusColor(status)}`}>
            <p className="text-sm font-medium mb-1">
              Текущий статус: {getStatusText(status)}
            </p>
            <p className="text-xs opacity-80">
              {status === "published" &&
                "Статья будет доступна для просмотра всем пользователям"}
              {status === "draft" &&
                "Статья будет сохранена как черновик и доступна только вам"}
              {status === "archived" &&
                "Статья будет перемещена в архив и скрыта от публичного просмотра"}
              {status === "deleted" &&
                "Статья будет помечена как удаленная (восстановление возможно через административную панель)"}
            </p>
          </div>
        </div>

        {/* Редактор контента */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Содержание статьи
          </label>
          <TipTapEditor
            content={content}
            onChange={setContent}
            maxChars={CONFIG_BLOG.MAX_ARTICLE_LENGTH}
          />
        </div>

        {/* Кнопки действий */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={handleSave}
            disabled={isSaving || !canSave}
            className={`${
              canSave && !isSaving
                ? "bg-primary hover:bg-primary/90 text-white cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } font-medium flex gap-x-4 justify-center items-center pl-3 pr-6 py-3 rounded duration-300`}
          >
            {isSaving ? (
              <>
                <Loader2 />
                Сохранение...
              </>
            ) : (
              <>
                <Image
                  src="/icons-orders/icon-check.svg"
                  alt="Сохранить статью"
                  width={24}
                  height={24}
                  className="brightness-0 invert"
                />
                Сохранить статью
              </>
            )}
          </button>

          <button
            onClick={() => {
              if (title || slug || description || content) {
                if (confirm("Очистить форму?")) {
                  setTitle("");
                  setSlug("");
                  setDescription("");
                  setContent("");
                  setStatus("draft");
                  setTitleError(false);
                  setSaveError(null);
                }
              }
            }}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 cursor-pointer duration-300"
          >
            Очистить
          </button>

          <button
            onClick={() => setShowPreview(true)}
            disabled={!content && !title}
            className={`px-6 py-3 border font-medium rounded duration-300 ${
              content || title
                ? "border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                : "border-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Предпросмотр
          </button>
        </div>

        {saveError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-red-700 text-sm font-medium">{saveError}</p>
          </div>
        )}
      </div>

      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-800">
                  Предпросмотр статьи
                </h2>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}
                >
                  {getStatusText(status)}
                </div>
              </div>
              <button
                onClick={handleClosePreview}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                aria-label="Закрыть предпросмотр"
              >
                <Image
                  src="/icons-auth/icon-closer.svg"
                  alt="Закрыть"
                  width={24}
                  height={24}
                  className="brightness-0 invert"
                />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose max-w-none mx-auto">
                <h1 className="text-4xl font-bold mb-4 text-gray-900">
                  {title || "Без заголовка"}
                </h1>

                {description && (
                  <div className="bg-gray-50 p-4 rounded mb-6">
                    <p className="text-gray-700 italic">{description}</p>
                  </div>
                )}

                <div
                  className="prose-lg"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {content.length} символов
                  {slug && `Алиас: ${slug}`}
                  {`Статус: ${getStatusText(status)}`}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleClosePreview}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-100 cursor-pointer duration-300"
                  >
                    Продолжить
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!canSave}
                    className={`px-6 py-3 font-medium rounded cursor-pointer duration-300 ${
                      canSave
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
