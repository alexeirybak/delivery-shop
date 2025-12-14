"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface SiteSettings {
  _id: string;
  siteKeywords: string[];
  semanticCore: string[];
  metaDescription: string;
  siteTitle: string;
  updatedAt: string;
}

export default function SemanticCorePage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Форма
  const [formData, setFormData] = useState({
    siteTitle: "",
    metaDescription: "",
    siteKeywords: "",
    semanticCore: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/site-settings");
      const data = await response.json();

      if (data.success) {
        setSettings(data.data);
        setFormData({
          siteTitle: data.data.siteTitle || "",
          metaDescription: data.data.metaDescription || "",
          siteKeywords: (data.data.siteKeywords || []).join(", "),
          semanticCore: (data.data.semanticCore || []).join(", "),
        });
      }
    } catch (error) {
      console.error("Ошибка загрузки настроек:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/administrator/blog/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteTitle: formData.siteTitle,
          metaDescription: formData.metaDescription,
          siteKeywords: formData.siteKeywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k.length > 0),
          semanticCore: formData.semanticCore
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k.length > 0),
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Настройки сохранены");
        loadSettings(); // Перезагружаем для отображения изменений
      } else {
        alert("Ошибка сохранения");
      }
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      alert("Ошибка сохранения настроек");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Хлебные крошки */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Link
              href="/administrator/blog"
              className="hover:text-primary hover:underline"
            >
              Статьи
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">
              SEO настройки сайта
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            SEO настройки сайта
          </h1>
          <p className="text-gray-600 mt-2">
            Настройки ключевых слов и семантического ядра для всего сайта
          </p>
        </div>

        {/* Форма */}
        <form
          onSubmit={handleSave}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="space-y-6">
            {/* Заголовок сайта */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Заголовок сайта (Title)
              </label>
              <input
                type="text"
                value={formData.siteTitle}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    siteTitle: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Название вашего сайта"
              />
              <p className="text-xs text-gray-500 mt-1">
                Отображается в заголовке браузера и поисковых системах
                (оптимально 50-60 символов)
              </p>
            </div>

            {/* Мета-описание */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Мета-описание (Description)
              </label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metaDescription: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Краткое описание вашего сайта для поисковых систем"
              />
              <p className="text-xs text-gray-500 mt-1">
                Оптимальная длина 150-160 символов. Отображается в сниппете
                поисковых систем
              </p>
            </div>

            {/* Ключевые слова сайта */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Ключевые слова сайта
                <span className="text-gray-500 text-sm font-normal ml-2">
                  (через запятую)
                </span>
              </label>
              <textarea
                value={formData.siteKeywords}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    siteKeywords: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="ключевое слово 1, ключевое слово 2, ключевое слово 3"
              />
              <p className="text-xs text-gray-500 mt-1">
                Основные ключевые слова, по которым продвигается сайт (не более
                10-15 слов)
              </p>
            </div>

            {/* Семантическое ядро */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Семантическое ядро
                <span className="text-gray-500 text-sm font-normal ml-2">
                  (через запятую)
                </span>
              </label>
              <textarea
                value={formData.semanticCore}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    semanticCore: e.target.value,
                  }))
                }
                rows={4}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="тематика 1, тематика 2, тематика 3, тематика 4"
              />
              <p className="text-xs text-gray-500 mt-1">
                Основные тематики и направления вашего сайта. Используются для
                структурирования контента
              </p>
            </div>

            {/* Текущие настройки */}
            {settings && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">
                  Текущие настройки:
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    <strong>Заголовок:</strong> {settings.siteTitle}
                  </div>
                  <div>
                    <strong>Ключевых слов:</strong>{" "}
                    {settings.siteKeywords?.length || 0}
                  </div>
                  <div>
                    <strong>Тематик:</strong>{" "}
                    {settings.semanticCore?.length || 0}
                  </div>
                  <div>
                    <strong>Обновлено:</strong>{" "}
                    {new Date(settings.updatedAt).toLocaleString("ru-RU")}
                  </div>
                </div>
              </div>
            )}

            {/* Кнопки */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50 cursor-pointer transition-colors"
              >
                {saving ? "Сохранение..." : "Сохранить настройки"}
              </button>
              <Link
                href="/administrator/blog"
                className="px-4 py-2 border rounded hover:bg-gray-50 cursor-pointer transition-colors"
              >
                Назад к статьям
              </Link>
            </div>
          </div>
        </form>

        {/* Рекомендации */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">
            Рекомендации по SEO:
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Используйте релевантные ключевые слова для вашей тематики</li>
            <li>• Не злоупотребляйте ключевыми словами (keyword stuffing)</li>
            <li>• Заголовок должен четко отражать суть сайта</li>
            <li>• Мета-описание должно заинтересовать пользователя</li>
            <li>
              • Обновляйте семантическое ядро при расширении тематики сайта
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
