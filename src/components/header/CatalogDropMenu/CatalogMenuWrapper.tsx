"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Category } from "@/types/categories";
import CatalogMenu from "../CatalogDropMenu/CatalogMenu";

const CatalogMenuWrapper = () => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchBlockRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const fetchCategories = async () => {
    if (categories.length > 0) return;
    try {
      const response = await fetch("/api/catalog");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setError({
        error: error instanceof Error ? error : new Error("Неизвестная ошибка"),
        userMessage: "Не удалось загрузить каталог категорий",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openMenu = () => {
    if (!isSearchFocused) {
      setIsCatalogOpen(true);
      fetchCategories();
    }
  };

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

  const handleSearchFocusAction = (focused: boolean) => {
    setIsSearchFocused(focused);
    if (focused) {
      setIsCatalogOpen(false);
    }
  };
  return (
    <CatalogMenu
      isLoading={isLoading}
      isCatalogOpen={isCatalogOpen}
      setIsCatalogOpen={setIsCatalogOpen}
      categories={categories}
      searchBlockRef={searchBlockRef}
      menuRef={menuRef}
      error={error}
      onMouseEnter={openMenu}
      onFocusChangeAction={handleSearchFocusAction}
    />
  );
};

export default CatalogMenuWrapper;
