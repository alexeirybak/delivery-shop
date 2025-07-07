"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { CatalogMenu } from "./CatalogMenu";
import { Category } from "@/types/categories";
import { ErrorState } from "@/types/errorState";

export const CatalogMenuWrapper = () => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<ErrorState>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchBlockRef = useRef<HTMLDivElement>(null!);
  const menuRef = useRef<HTMLDivElement>(null!);

  const fetchCategories = useCallback(async () => {
    if (categories.length > 0 || isLoading) return;
    try {
      setIsLoading(true);
      setError(null); // Сбрасываем ошибку перед новым запросом
      const response = await fetch("/api/catalog");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setError({
        error: error instanceof Error ? error : new Error("Неизвестная ошибка"),
        userMessage: "Ошибка загрузки категорий.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [categories.length, isLoading]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!searchBlockRef.current || !isCatalogOpen || isSearchFocused) return;

      const isInsideMenu = menuRef.current?.contains(e.target as Node);
      if (isInsideMenu) return;

      const searchBlockRect = searchBlockRef.current.getBoundingClientRect();
      if (
        e.clientX < searchBlockRect.left ||
        e.clientX > searchBlockRect.right
      ) {
        setIsCatalogOpen(false);
      }
    },
    [isCatalogOpen, isSearchFocused]
  );

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const handleSearchFocusAction = useCallback((focused: boolean) => {
    setIsSearchFocused(focused);
    if (focused) setIsCatalogOpen(false);
  }, []);

  const openMenu = useCallback(() => {
    if (!isSearchFocused) {
      setIsCatalogOpen(true);
      fetchCategories();
    }
  }, [isSearchFocused, fetchCategories]);

  return (
    <div>
      {error ? (
        <div className="p-2 text-red-600 text-sm">
          {error.userMessage}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-blue-500 hover:text-blue-700 cursor-pointer"
          >
            Повторить
          </button>
        </div>
      ) : (
        <CatalogMenu
          isCatalogOpen={isCatalogOpen}
          isLoading={isLoading}
          categories={categories}
          isSearchFocused={isSearchFocused}
          searchBlockRef={searchBlockRef}
          menuRef={menuRef}
          onFocusChangeAction={handleSearchFocusAction}
          setIsCatalogOpen={setIsCatalogOpen}
          onMouseEnter={openMenu}
        />
      )}
    </div>
  );
};
