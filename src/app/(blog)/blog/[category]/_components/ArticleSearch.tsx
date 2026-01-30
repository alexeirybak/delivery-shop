"use client";

import { useState, FormEvent } from "react";
import { Search } from "lucide-react";
import { Article } from "@/app/(blog)/blog/types";

interface ArticleSearchProps {
  onSearchResults: (articles: Article[] | null, searchTerm?: string) => void;
  placeholder?: string;
  className?: string;
  minLength?: number;
}

export default function ArticleSearch({
  onSearchResults,
  placeholder = "Поиск статей...",
  className = "",
  minLength = 2,
}: ArticleSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (searchTerm.trim().length < minLength) {
      setError(`Введите минимум ${minLength} символа`);
      return;
    }

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
        onSearchResults(null, searchTerm);
      } else {
        onSearchResults(data.articles || [], searchTerm);
      }
    } catch (err) {
      setError("Ошибка при выполнении поиска");
      console.error("Search error:", err);
      onSearchResults(null, searchTerm);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setError("");
    onSearchResults(null);
  };

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setError("");
              }}
              placeholder={placeholder}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              disabled={isSearching}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Очистить поиск"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={isSearching || searchTerm.trim().length < minLength}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSearching ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Поиск...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Найти</span>
              </>
            )}
          </button>
        </div>

        {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}

        {searchTerm.trim().length > 0 &&
          searchTerm.trim().length < minLength && (
            <p className="mt-2 text-yellow-600 text-sm">
              Введите минимум {minLength} символа для поиска
            </p>
          )}
      </form>
    </div>
  );
}
