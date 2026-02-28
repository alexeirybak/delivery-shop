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
          <div className="flex flex-col gap-2 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-main-text" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setError("");
                }}
                placeholder="Название или описание статьи"
                className="w-full py-3 pl-10 pr-10 text-xs border border-gray-300 rounded outline-none md:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500"
                disabled={isSearching}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute transform -translate-y-1/2 cursor-pointer right-3 top-1/2 text-main-text hover:text-main-text duration-30"
                  aria-label="Очистить поиск"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isSearching || searchTerm.trim().length < 3}
              className="flex items-center justify-center gap-2 px-6 py-3 text-white bg-green-600 rounded cursor-pointer hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-custom"
            >
              {isSearching ? (
                <>
                  <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
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

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          {searchTerm.trim().length > 0 && searchTerm.trim().length < 3 && (
            <p className="mt-2 text-sm text-yellow-600">
              Введите минимум 3 символа для поиска
            </p>
          )}
        </form>

        {showResults && searchResults.searchTerm && (
          <div className="mt-4">
            <div className="overflow-hidden bg-white border border-gray-200 rounded shadow-lg">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-main-text">
                  {searchResults.articles === null
                    ? "Ошибка поиска"
                    : searchResults.articles.length === 0
                      ? `По запросу "${searchResults.searchTerm}" ничего не найдено`
                      : `Найдено статей ${searchResults.articles.length} по запросу "${searchResults.searchTerm}"`}
                </h3>
                <button
                  onClick={closeResults}
                  className="cursor-pointer text-main-text hover:text-gray-700 transition-custom"
                  aria-label="Закрыть результаты"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {searchResults.articles && searchResults.articles.length > 0 && (
                <div className="overflow-y-auto divide-y divide-gray-100 max-h-96">
                  {searchResults.articles.map((article) => (
                    <Link
                      key={article._id}
                      href={`/blog/${article.category?.slug}/${article.slug}`}
                      className="block p-4 hover:bg-gray-50 transition-custom"
                      onClick={closeResults}
                    >
                      <div className="flex items-start gap-3">
                        {article.image ? (
                          <div className="w-16 h-16 shrink-0">
                            <Image
                              src={article.image}
                              alt={article.imageAlt || article.name}
                              width={64}
                              height={64}
                              className="object-cover w-full h-full rounded"
                            />
                          </div>
                        ) : (
                          <div
                            className={`shrink-0 w-16 h-11 flex items-center justify-center rounded bg-linear-to-br ${getColorFromName(article.name)}`}
                          ></div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate text-main-text">
                            {article.name}
                          </h4>

                          {article.description && (
                            <p className="mt-1 text-sm text-main-text line-clamp-2">
                              {article.description}
                            </p>
                          )}

                          <div className="flex items-center gap-3 mt-2 text-xs text-main-text">
                            {article.category?.name && (
                              <span className="px-2 py-1 text-green-800 bg-green-100 rounded">
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

              {searchResults.articles &&
                searchResults.articles.length === 0 && (
                  <div className="p-6 text-center">
                    <div className="mb-2 text-main-text">
                      <Search className="w-12 h-12 mx-auto" />
                    </div>
                    <p className="mb-2 text-main-text">
                      По запросу{" "}
                      <span className="font-semibold">
                        &quot;{searchResults.searchTerm}&quot;
                      </span>{" "}
                      ничего не найдено
                    </p>
                    <p className="text-sm text-main-text">
                      Попробуйте изменить запрос
                    </p>
                  </div>
                )}

              {searchResults.articles === null && (
                <div className="p-6 text-center">
                  <p className="mb-2 text-red-600">
                    Произошла ошибка при поиске
                  </p>
                  <p className="text-sm text-main-text">
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
