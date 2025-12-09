"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { transliterate } from "../../../../../../utils/transliterate";
import { SEO_LIMITS } from "../utils/seo-limits";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    keywords: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Валидация названия
    if (
      formData.name.length < SEO_LIMITS.name.min ||
      formData.name.length > SEO_LIMITS.name.max
    ) {
      newErrors.name = SEO_LIMITS.name.message;
    }

    // Валидация slug
    if (
      formData.slug.length < SEO_LIMITS.slug.min ||
      formData.slug.length > SEO_LIMITS.slug.max
    ) {
      newErrors.slug = `Slug должен быть от ${SEO_LIMITS.slug.min} до ${SEO_LIMITS.slug.max} символов`;
    } else if (!SEO_LIMITS.slug.pattern.test(formData.slug)) {
      newErrors.slug = SEO_LIMITS.slug.message;
    }

    // Валидация описания
    if (
      formData.description &&
      (formData.description.length < SEO_LIMITS.description.min ||
        formData.description.length > SEO_LIMITS.description.max)
    ) {
      newErrors.description = SEO_LIMITS.description.message;
    }

    // Валидация ключевых слов
    if (formData.keywords) {
      const keywordsArray = formData.keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      if (keywordsArray.length > SEO_LIMITS.keywords.maxCount) {
        newErrors.keywords = `Максимум ${SEO_LIMITS.keywords.maxCount} ключевых слов`;
      }

      if (formData.keywords.length > SEO_LIMITS.keywords.maxLength) {
        newErrors.keywords = SEO_LIMITS.keywords.message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch("/administrator/blog/api/categories");
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Ошибка загрузки категорий:", error);
      alert("Ошибка загрузки категорий");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      keywords: "",
    });
    setEditingId(null);
    setShowCreateForm(false);
    setErrors({});
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Пожалуйста, исправьте ошибки в форме");
      return;
    }

    try {
      const keywordsArray = formData.keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      const response = await fetch("/administrator/blog/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          keywords: keywordsArray,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Категория создана");
        resetForm();
        loadCategories();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Ошибка создания категории:", error);
      alert("Ошибка создания категории");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category._id);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      keywords: (category.keywords || []).join(", "),
    });
    setShowCreateForm(true);
    setErrors({});
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingId) return;

    if (!validateForm()) {
      alert("Пожалуйста, исправьте ошибки в форме");
      return;
    }

    try {
      const keywordsArray = formData.keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      const response = await fetch(
        `/administrator/blog/api/categories/${editingId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            keywords: keywordsArray,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Категория обновлена");
        resetForm();
        loadCategories();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Ошибка обновления категории:", error);
      alert("Ошибка обновления категории");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту категорию?")) return;

    try {
      const response = await fetch(`/administrator/blog/api/categories/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        alert("Категория удалена");
        loadCategories();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Ошибка удаления категории:", error);
      alert("Ошибка удаления категории");
    }
  };

  const handleSlugGenerate = () => {
    if (!formData.name.trim()) {
      alert("Сначала введите название категории");
      return;
    }

    // Используем функцию с параметром toSlug: true
    const slug = transliterate(formData.name, true);
    setFormData((prev) => ({ ...prev, slug }));

    // Очищаем ошибку slug при генерации
    if (errors.slug) {
      setErrors((prev) => ({ ...prev, slug: "" }));
    }
  };

  // Подсчет символов
  const charCount = {
    name: formData.name.length,
    description: formData.description.length,
    keywords: formData.keywords.length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Link
              href="/administrator/blog"
              className="hover:text-primary hover:underline"
            >
              Статьи
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Категории</span>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Управление категориями
              </h1>
              <p className="text-gray-600 mt-2">
                Всего категорий: {categories.length}
              </p>
            </div>

            <button
              onClick={() => {
                resetForm();
                setShowCreateForm(true);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer transition-colors flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Новая категория
            </button>
          </div>
        </div>

        {/* SEO рекомендации */}
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">
            SEO рекомендации:
          </h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Название: 2-60 символов (оптимально 30-40)</li>
            <li>• Slug: только латиница, цифры и дефисы, 2-60 символов</li>
            <li>• Описание: 10-160 символов (мета-описание для поисковиков)</li>
            <li>• Ключевые слова: до 10 слов, разделенных запятыми</li>
          </ul>
        </div>

        {/* Форма создания/редактирования */}
        {showCreateForm && (
          <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingId
                ? "Редактирование категории"
                : "Создание новой категории"}
            </h2>

            <form onSubmit={editingId ? handleUpdate : handleCreate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Название */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium">
                      Название категории *
                    </label>
                    <span
                      className={`text-xs ${charCount.name > SEO_LIMITS.name.max ? "text-red-600" : "text-gray-500"}`}
                    >
                      {charCount.name}/{SEO_LIMITS.name.max}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= SEO_LIMITS.name.max) {
                        setFormData((prev) => ({ ...prev, name: value }));
                      }
                    }}
                    required
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.name ? "border-red-500" : ""
                    }`}
                    placeholder="Например: Программирование"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Slug */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium">
                      Алиас (slug) *
                    </label>
                    <span
                      className={`text-xs ${formData.slug.length > SEO_LIMITS.slug.max ? "text-red-600" : "text-gray-500"}`}
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
                        // Автоматически заменяем пробелы на дефисы и удаляем недопустимые символы
                        const cleaned = value
                          .replace(/\s+/g, "-")
                          .replace(/[^a-z0-9-]/g, "");
                        if (cleaned.length <= SEO_LIMITS.slug.max) {
                          setFormData((prev) => ({ ...prev, slug: cleaned }));
                        }
                      }}
                      required
                      className={`flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        errors.slug ? "border-red-500" : ""
                      }`}
                      placeholder="programming"
                    />
                    <button
                      type="button"
                      onClick={handleSlugGenerate}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm whitespace-nowrap"
                      title="Сгенерировать из названия"
                    >
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
                    <label className="block text-sm font-medium">
                      Описание (мета-описание)
                    </label>
                    <span
                      className={`text-xs ${
                        charCount.description > SEO_LIMITS.description.max
                          ? "text-red-600"
                          : charCount.description <
                                SEO_LIMITS.description.min &&
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
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= SEO_LIMITS.description.max) {
                        setFormData((prev) => ({
                          ...prev,
                          description: value,
                        }));
                      }
                    }}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.description ? "border-red-500" : ""
                    }`}
                    placeholder="Краткое описание категории для поисковых систем (10-160 символов)"
                  />
                  {errors.description ? (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.description}
                    </p>
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
                    <label className="block text-sm font-medium">
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
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= SEO_LIMITS.keywords.maxLength) {
                        setFormData((prev) => ({ ...prev, keywords: value }));
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.keywords ? "border-red-500" : ""
                    }`}
                    placeholder="программирование, код, разработка, IT"
                  />
                  {errors.keywords && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.keywords}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 cursor-pointer transition-colors"
                >
                  {editingId ? "Сохранить изменения" : "Создать категорию"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border rounded hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Таблица категорий */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Загрузка категорий...
            </div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">Категорий пока нет</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 cursor-pointer transition-colors"
              >
                Создать первую категорию
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Название
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Алиас
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Описание
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Ключевые слова
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Дата создания
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {category.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {category.slug}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className="text-gray-600 max-w-xs truncate"
                          title={category.description}
                        >
                          {category.description || (
                            <span className="text-gray-400">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(category.keywords || []).length > 0 ? (
                            (category.keywords || []).map((keyword, index) => (
                              <span
                                key={index}
                                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                              >
                                {keyword}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(category.createdAt).toLocaleDateString(
                          "ru-RU"
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer transition-colors text-sm"
                          >
                            Редактировать
                          </button>
                          <button
                            onClick={() => handleDelete(category._id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer transition-colors text-sm"
                          >
                            Удалить
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Внимание:</strong> Удаление категории допустимо только если
            в ней нет статей. При удалении категории все статьи должны быть
            перенесены в другие категории.
          </p>
        </div>
      </div>
    </div>
  );
}
