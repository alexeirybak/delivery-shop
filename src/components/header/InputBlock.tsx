"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import burger from "/public/icons-products/icon-burger-menu.svg";
import iconSearch from "/public/icons-header/icon-search.svg";
import { PATH_TRANSLATIONS } from "../../../utils/pathTranslations";
import HighlightText from "./HighlightText";

export type SearchProduct = {
  id: number;
  title: string;
  categories: string[];
};

export default function InputBlock({
  onFocusChangeAction,
}: {
  onFocusChangeAction: (focused: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [groupedProducts, setGroupedProducts] = useState<
    { category: string; products: SearchProduct[] }[]
  >([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSearchData = async () => {
      if (query.length > 1) {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/search?query=${query}`);
          const data = await response.json();
          setGroupedProducts(data || []);
        } catch (error) {
          console.error("Ошибка поиска:", error);
          setGroupedProducts([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setGroupedProducts([]);
      }
    };

    const debounceTimer = setTimeout(fetchSearchData, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      resetSearch()
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    onFocusChangeAction(true);
  };

  const handleInputBlur = () => {
    onFocusChangeAction(false);
  };

  const resetSearch = () => {
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div className="relative min-w-[261px] flex-grow" ref={searchRef}>
      <form
        onSubmit={(e) => {
          e.preventDefault(); 
          handleSearch();
        }}
        className="relative rounded border border-(--color-primary)"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Найти товар"
          className="w-full h-10 px-2 outline-none text-[#8f8f8f]"
        />
        <button
          type="submit" // Важно указать type="submit"
          className="absolute top-0 right-0 h-10 w-10 flex items-center justify-center"
        >
          <Image src={iconSearch} alt="Поиск" width={24} height={24} />
        </button>
      </form>

      {isOpen && (
        <div className="absolute -mt-0.5 left-0 right-0 z-10 max-h-[300px] overflow-y-auto bg-white rounded-b border border-(--color-primary) border-t-0 shadow-inherit">
          {isLoading ? (
            <div className="p-4 text-center">Поиск...</div>
          ) : groupedProducts.length > 0 ? (
            <div className="px-2 flex flex-col gap-2.5">
              {groupedProducts.map((group) => (
                <div key={group.category} className="flex flex-col gap-2.5">
                  <Link
                    href={`/category/${encodeURIComponent(group.category)}`}
                    className="flex items-start gap-x-4 hover:bg-gray-100"
                    onClick={resetSearch}
                  >
                    <div>
                      <HighlightText
                        text={
                          PATH_TRANSLATIONS[group.category] || group.category
                        }
                        highlight={query}
                      />
                    </div>
                    <Image
                      src={burger}
                      alt={PATH_TRANSLATIONS[group.category] || group.category}
                      width={24}
                      height={24}
                      className="flex-shrink-0"
                    />
                  </Link>

                  <ul className="flex flex-col gap-2.5">
                    {group.products.map((product) => (
                      <li key={product.id} className="hover:bg-gray-100">
                        <Link
                          href={`/product/${product.id}`}
                          className="cursor-pointer"
                          onClick={resetSearch}
                        >
                          <HighlightText
                            text={product.title}
                            highlight={query}
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : query.length > 1 ? (
            <div className="text-gray-500 py-2 px-4">Ничего не найдено</div>
          ) : (
            <div className="p-4 text-gray-500">
              Введите 2 и более символов для поиска
            </div>
          )}
        </div>
      )}
    </div>
  );
}
