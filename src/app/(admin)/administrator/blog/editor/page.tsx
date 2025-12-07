"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { CONFIG_BLOG } from "../../editor/utils/config-blog";
import TipTapEditor from "../../editor/_components/TipTapEditor";
import MiniLoader from "@/components/MiniLoader";

interface Article {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  status: string;
  tags: string[];
}

interface UpdateArticleData {
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  status: string;
  tags: string[];
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const categorySelectRef = useRef<HTMLSelectElement>(null);

  const [article, setArticle] = useState<Article>({
    _id: "",
    title: "",
    slug: "",
    description: "",
    content: "",
    category: "general",
    status: "draft",
    tags: [],
  });

  // Загрузка статьи и категорий
  useEffect(() => {
    if (params.id) {
      loadArticleAndCategories();
    }
  }, [params.id]);

  const loadArticleAndCategories = async () => {
    try {
      // Загружаем статью и категории параллельно
      const [articleResponse, categoriesResponse] = await Promise.all([
        fetch("/api/posts/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "getArticle",
            id: params.id,
          }),
        }),
        fetch("/api/categories", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }),
      ]);

      const articleData = await articleResponse.json();
      const categoriesData = await categoriesResponse.json();

      if (articleData.success) {
        setArticle(articleData.data);
      } else {
        setError("Статья не найдена");
      }

      if (categoriesData.success) {
        setCategories(categoriesData.data);
      } else {
        console.error("Ошибка загрузки категорий:", categoriesData.message);
      }
    } catch (error) {
      console.error("Ошибка загрузки:", error);
      setError("Ошибка загрузки данных");
    } finally {
      setLoading(false);
      setIsLoadingCategories(false);
    }
  };

  const handleAddNewCategory = async () => {
    if (!newCategoryName.trim()) {
      setError("Введите название категории");
      return;
    }

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategoryName.trim(),
          slug: newCategoryName.trim().toLowerCase().replace(/\s+/g, "-"),
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Добавляем новую категорию в список
        const newCategory = data.data;
        setCategories([...categories, newCategory]);
        
        // Устанавливаем новую категорию как выбранную
        setArticle({ ...article, category: newCategory.slug });
        
        // Сбрасываем форму
        setNewCategoryName("");
        setShowNewCategory(false);
        
        alert("Категория успешно создана!");
      } else {
        setError(data.message || "Ошибка создания категории");
      }
    } catch (error) {
      console.error("Ошибка создания категории:", error);
      setError("Ошибка создания категории");
    }
  };

  const handleSave = async () => {
    if (!article.title.trim()) {
      setError("Заголовок обязателен");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const updateData: UpdateArticleData = {
        title: article.title,
        slug: article.slug,
        description: article.description,
        content: article.content,
        category: article.category,
        status: article.status,
        tags: article.tags,
      };

      const response = await fetch("/api/posts/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          id: params.id,
          data: updateData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Статья сохранена!");
        router.push("/administrator/blog");
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      setError("Ошибка сохранения статьи");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteArticle = async () => {
    if (!confirm("Вы уверены, что хотите удалить эту статью? Она будет помечена как удаленная, но останется в базе данных.")) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      // Просто меняем статус на "deleted"
      const response = await fetch("/api/posts/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          id: params.id,
          data: {
            ...article,
            status: "deleted",
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Статья помечена как удаленная!");
        router.push("/administrator/blog");
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Ошибка удаления:", error);
      setError("Ошибка удаления статьи");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <MiniLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Редактирование статьи</h1>
            <p className="text-gray-600 mt-2">ID: {article._id}</p>
          </div>
          <button
            onClick={handleDeleteArticle}
            disabled={saving}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            Удалить статью
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Заголовок *
            </label>
            <input
              type="text"
              value={article.title}
              onChange={(e) =>
                setArticle({ ...article, title: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Заголовок статьи"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Алиас (URL)
            </label>
            <input
              type="text"
              value={article.slug}
              onChange={(e) => setArticle({ ...article, slug: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="article-url"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категория
              </label>
              {isLoadingCategories ? (
                <div className="animate-pulse h-12 bg-gray-200 rounded"></div>
              ) : (
                <>
                  <div className="flex gap-2 mb-2">
                    <select
                      ref={categorySelectRef}
                      value={article.category}
                      onChange={(e) =>
                        setArticle({ ...article, category: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="">Выберите категорию</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowNewCategory(!showNewCategory)}
                      className="px-4 py-3 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 whitespace-nowrap"
                    >
                      {showNewCategory ? "Отмена" : "+ Новая"}
                    </button>
                  </div>

                  {showNewCategory && (
                    <div className="mt-4 p-4 border border-gray-300 rounded">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Новая категория
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="Название категории"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddNewCategory();
                            }
                          }}
                        />
                        <button
                          onClick={handleAddNewCategory}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Добавить
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Статус
              </label>
              <select
                value={article.status}
                onChange={(e) =>
                  setArticle({ ...article, status: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="draft">Черновик</option>
                <option value="published">Опубликовано</option>
                <option value="archived">Архив</option>
                <option value="deleted">Удалено</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание
            </label>
            <textarea
              value={article.description}
              onChange={(e) =>
                setArticle({ ...article, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary resize-none"
              placeholder="Краткое описание"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Содержание
            </label>
            <TipTapEditor
              content={article.content}
              onChange={(content) => setArticle({ ...article, content })}
              maxChars={CONFIG_BLOG.MAX_ARTICLE_LENGTH}
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? "Сохранение..." : "Сохранить"}
            </button>
            <button
              onClick={() => router.push("/administrator/blog")}
              className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-50"
            >
              Отмена
            </button>
            <a
              href={`/blog/${article.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Просмотр
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}