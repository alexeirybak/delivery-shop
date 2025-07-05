"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import UserBlock from "./UserBlock";
import LogoBlock from "./LogoBlock";
import SearchBlock from "./SearchBlock";

type Category = {
  id: number;
  title: string;
};

const Header = () => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const catalogButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node) &&
        catalogButtonRef.current &&
        !catalogButtonRef.current.contains(event.target as Node)
      ) {
        setIsCatalogOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/catalog");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Ошибка загрузки категорий:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isCatalogOpen) fetchCategories();
  }, [isCatalogOpen]);

const handleSearchFocusAction = (focused: boolean) => {
    setIsSearchFocused(focused);
    if (focused) {
      setIsCatalogOpen(false);
    }
  };

  const handleCatalogHover = () => {
    if (!isSearchFocused) {
      setIsCatalogOpen(true);
    }
  };

  return (
    <header
      ref={headerRef}
      className="bg-white w-full md:shadow-(--shadow-default) relative z-50 flex flex-col md:flex-row md:gap-y-5 xl:gap-y-7 md:gap-10 md:p-2 justify-center"
    >
      <div
        ref={catalogButtonRef}
        className="flex flex-row gap-4 xl:gap-10 py-2 px-4 items-center shadow-(--shadow-default) md:shadow-none"
        onMouseEnter={handleCatalogHover}
      >
        <LogoBlock />
        <SearchBlock 
          onFocusChangeAction={handleSearchFocusAction}
          
        />
      </div>

      {isCatalogOpen && (
        <div 
          className="hidden md:block absolute top-full left-0 w-full bg-white shadow-(--shadow-search-menu) z-50"
          onMouseLeave={() => setIsCatalogOpen(false)}
        >
          <div className="mx-auto px-4 py-3">
            {isLoading ? (
              <div className="py-2 text-center">Загрузка...</div>
            ) : categories.length > 0 ? (
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.id}`}
                    className="block px-4 py-2 text-[#414141] hover:text-[#ff6633] font-bold duration-300 rounded"
                    onClick={() => setIsCatalogOpen(false)}
                  >
                    {category.title}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-2 text-center text-gray-500">
                Нет доступных категорий
              </div>
            )}
          </div>
        </div>
      )}

      <UserBlock />
    </header>
  );
};

export default Header;