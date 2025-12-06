"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import TipTapEditor from "./_components/TipTapEditor";
import { createSlug } from "./utils/createSlug";
import { CONFIG_BLOG } from "./utils/config-blog";

export default function EditorPage() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [saveError, setSaveError] = useState(false);

  // Автоматическое создание slug при изменении заголовка
  useEffect(() => {
    if (title.trim() && !slug) {
      setSlug(createSlug(title));
    }
  }, [title, slug]);

  const handleTitleChange = (value: string) => {
    if (value.length <= CONFIG_BLOG.TITLE_MAX_LENGTH) {
      setTitle(value);
      setTitleError(false); // Сбрасываем ошибку при вводе
      setSaveError(false); // Сбрасываем ошибку сохранения
    }
  };

  const handleSlugChange = (value: string) => {
    // Разрешаем только латинские буквы, цифры и дефисы
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

  const handleSave = () => {
    // Проверяем, что заголовок заполнен
    if (!title.trim()) {
      setSaveError(true);
      setTitleError(true);

      // Прокручиваем к заголовку
      document
        .querySelector('input[placeholder="Введите заголовок..."]')
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

      return;
    }

    setSaveError(false);

    console.log("Сохраняем контент:", {
      title,
      slug,
      description,
      content,
    });

    // Здесь отправка на сервер
    // await fetch('/api/posts', {
    //   method: 'POST',
    //   body: JSON.stringify({ title, slug, description, content })
    // })
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handleGenerateSlug = () => {
    if (title.trim()) {
      setSlug(createSlug(title));
      setTitleError(false);
    } else {
      // Подсвечиваем поле заголовка красным
      setTitleError(true);

      // Прокручиваем к заголовку
      document
        .querySelector('input[placeholder="Введите заголовок..."]')
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }
  };

  // Проверка возможности сохранения
  const canSave = title.trim().length > 0;
  const canPreview = content.trim().length > 0 || title.trim().length > 0;

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-2">Редактор статей</h1>

        {/* Заголовок */}
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
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
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
              Алиас (URL)
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
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
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
              Описание (мета-описание)
            </label>
            <span className="text-sm text-gray-500">
              {description.length}/{CONFIG_BLOG.DESCRIPTION_MAX_LENGTH}
            </span>
          </div>
          <textarea
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition resize-none"
            placeholder="Краткое описание статьи для SEO..."
          />
          <p className="mt-1 text-sm text-gray-500">
            Рекомендуется {CONFIG_BLOG.DESCRIPTION_MAX_LENGTH} символов для
            лучшего отображения в поисковых системах.
          </p>
        </div>

        {/* Редактор контента */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Содержание статьи
          </label>
          <TipTapEditor
            content={content}
            onChange={setContent}
            placeholder="Начните писать вашу статью здесь..."
            maxChars={10000}
          />
        </div>

        {/* Кнопки действий */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={`${
              canSave
                ? "bg-primary hover:shadow-button-default active:shadow-button-active text-white cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } font-medium flex gap-x-4 justify-center items-center pl-3 pr-6 py-3 rounded duration-300`}
          >
            <Image
              src="/icons-orders/icon-check.svg"
              alt="Сохранить статью"
              width={24}
              height={24}
              className={canSave ? "brightness-0 invert" : "opacity-50"}
            />
            Сохранить
          </button>

          <button
            onClick={() => {
              setTitle("");
              setSlug("");
              setDescription("");
              setContent("");
              setTitleError(false);
              setSaveError(false);
            }}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 cursor-pointer duration-300"
          >
            Очистить
          </button>

          <button
            onClick={() => setShowPreview(true)}
            disabled={!canPreview}
            className={`px-6 py-3 border font-medium rounded duration-300 ${
              canPreview
                ? "border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                : "border-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Предпросмотр
          </button>
        </div>

        {/* Сообщение об ошибке сохранения */}
        {saveError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">
              <span className="font-medium">
                Нельзя сохранить статью без заголовка.
              </span>{" "}
              Пожалуйста, заполните заголовок статьи.
            </p>
          </div>
        )}

        {/* Информация о валидации */}
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">
            <span className="font-medium">Примечание:</span> Поля отмеченные *
            обязательны для заполнения. Статья не может быть сохранена без
            заголовка.
          </p>
        </div>

        {/* Предпросмотр внизу страницы */}
        {content && (
          <div className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-bold mb-4">Предпросмотр</h2>
            <div className="prose max-w-none">
              <h1 className="text-3xl font-bold mb-4">
                {title || "Без заголовка"}
              </h1>
              {description && (
                <p className="text-gray-600 italic mb-4">{description}</p>
              )}
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </div>
        )}
      </div>

      {/* Модальное окно предпросмотра */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                Предпросмотр статьи
              </h2>
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

                {slug && (
                  <div className="text-sm text-gray-500 mb-2">
                    <span className="font-medium">URL:</span> /blog/{slug}
                  </div>
                )}

                <div className="text-gray-600 mb-4 text-sm">
                  {new Date().toLocaleDateString("ru-RU", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>

                {description && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-6 border-l-4 border-primary">
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
                  {slug && ` • Алиас: ${slug}`}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleClosePreview}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-100 cursor-pointer duration-300"
                  >
                    Продолжить
                  </button>
                  <button
                    onClick={() => {
                      if (title.trim()) {
                        handleSave();
                        handleClosePreview();
                      }
                    }}
                    disabled={!title.trim()}
                    className={`px-6 py-3 font-medium rounded cursor-pointer duration-300 ${
                      title.trim()
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Опубликовать
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
