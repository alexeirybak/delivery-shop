"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { getColorFromName } from "../../../../utils/getColorFromName";
import { SearchResult } from "./types";


export default function BlogSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult>({
    articles: null,
  });
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSearching(true);
    setError("");

    try {
      const response = await fetch(
        `/api/blog/search?q=${encodeURIComponent(searchTerm)}`,
      );

      if (!response.ok) {
        throw new Error(`Ошибка поиска: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setSearchResults({ articles: null, searchTerm });
      } else {
        setSearchResults({
          articles: data.articles || [],
          searchTerm,
        });
        setShowResults(true);
      }
    } catch (err) {
      setError("Ошибка при выполнении поиска");
      console.error("Search error:", err);
      setSearchResults({ articles: null, searchTerm });
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setError("");
    setSearchResults({ articles: null });
    setShowResults(false);
  };

  const closeResults = () => {
    setShowResults(false);
  };

  return (
    <div className="relative mb-8">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-main-text w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setError("");
                }}
                placeholder="Название или описание статьи"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                disabled={isSearching}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-main-text hover:text-main-text duration-30 cursor-pointer"
                  aria-label="Очистить поиск"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isSearching || searchTerm.trim().length < 3}
              className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 duration-300 cursor-pointer"
            >
              {isSearching ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Поиск...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Найти</span>
                </>
              )}
            </button>
          </div>

          {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}

          {searchTerm.trim().length > 0 && searchTerm.trim().length < 3 && (
            <p className="mt-2 text-yellow-600 text-sm">
              Введите минимум 3 символа для поиска
            </p>
          )}
        </form>

        {/* Результаты поиска */}
        {showResults && searchResults.searchTerm && (
          <div className="mt-4">
            <div className="bg-white rounded shadow-lg border border-gray-200 overflow-hidden">
              {/* Заголовок результатов */}
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-main-text">
                  {searchResults.articles === null
                    ? "Ошибка поиска"
                    : searchResults.articles.length === 0
                      ? `По запросу "${searchResults.searchTerm}" ничего не найдено`
                      : `Найдено статей ${searchResults.articles.length} по запросу "${searchResults.searchTerm}"`}
                </h3>
                <button
                  onClick={closeResults}
                  className="text-main-text hover:text-gray-700 duration-300 cursor-pointer"
                  aria-label="Закрыть результаты"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Список результатов */}
              {searchResults.articles && searchResults.articles.length > 0 && (
                <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                  {searchResults.articles.map((article) => (
                    <Link
                      key={article._id}
                      href={`/blog/${article.category?.slug}/${article.slug}`}
                      className="block p-4 hover:bg-gray-50 duration-300"
                      onClick={closeResults}
                    >
                      <div className="flex items-start gap-3">
                        {article.image ? (
                          <div className="shrink-0 w-16 h-16">
                            <Image
                              src={article.image}
                              alt={article.imageAlt || article.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                        ) : (
                          <div
                            className={`shrink-0 w-16 h-11 flex items-center justify-center rounded bg-linear-to-br ${getColorFromName(article.name)}`}
                          ></div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-main-text truncate">
                            {article.name}
                          </h4>

                          {article.description && (
                            <p className="text-main-text text-sm mt-1 line-clamp-2">
                              {article.description}
                            </p>
                          )}

                          <div className="flex items-center gap-3 mt-2 text-xs text-main-text">
                            {article.category?.name && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                                {article.category.name}
                              </span>
                            )}

                            {article.publishedAt && (
                              <span>
                                {new Date(
                                  article.publishedAt,
                                ).toLocaleDateString("ru-RU")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Сообщение "ничего не найдено" */}
              {searchResults.articles &&
                searchResults.articles.length === 0 && (
                  <div className="p-6 text-center">
                    <div className="text-main-text mb-2">
                      <Search className="w-12 h-12 mx-auto" />
                    </div>
                    <p className="text-main-text mb-2">
                      По запросу{" "}
                      <span className="font-semibold">
                        &quot;{searchResults.searchTerm}&quot;
                      </span>{" "}
                      ничего не найдено
                    </p>
                    <p className="text-main-text text-sm">
                      Попробуйте изменить запрос
                    </p>
                  </div>
                )}

              {searchResults.articles === null && (
                <div className="p-6 text-center">
                  <p className="text-red-600 mb-2">
                    Произошла ошибка при поиске
                  </p>
                  <p className="text-main-text text-sm">
                    Пожалуйста, попробуйте позже
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}