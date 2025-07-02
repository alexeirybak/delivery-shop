"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import burger from "/public/icons-products/icon-burger-menu.svg";
import iconSearch from "/public/icons-header/icon-search.svg";
import { REVERSE_CATEGORY_TRANSLATIONS } from "../../../utils/categoryTranslations";

type SearchProduct = {
  id: number;
  img: string;
  title: string;
  categories: string[];
  tags?: string[];
  isFood?: boolean;
};

function HighlightText({
  text,
  highlight,
}: {
  text: string;
  highlight: string;
}) {
  if (!highlight.trim()) return <>{text}</>;

  const parts = text.split(new RegExp(`(${highlight})`, "gi"));

  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="font-bold">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
}

export default function InputBlock() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    products: SearchProduct[];
    categories: string[];
  } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const groupedProducts =
    results?.categories
      .map((category) => ({
        category,
        products: results.products.filter((product) =>
          product.categories.includes(category)
        ),
      }))
      .filter((group) => group.products.length > 0) || [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 1) {
      setIsLoading(true);
      fetch(`/api/search?query=${query}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data);
          setIsLoading(false);
        });
    } else {
      setResults(null);
    }
  }, [query]);

  const translateCategory = (category: string) => {
    return REVERSE_CATEGORY_TRANSLATIONS[category] || category;
  };

  return (
    <div className="relative min-w-[261px] flex-grow" ref={searchRef}>
      <div className="relative">
        <div className={`rounded border border-(--color-primary)`}>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
              placeholder="Найти товар"
              className="w-full h-10 px-2 outline-none text-[#8f8f8f]"
            />
            <Image
              src={iconSearch}
              alt="Поиск"
              width={24}
              height={24}
              className="absolute top-2 right-2"
            />
          </div>
        </div>

        {isOpen && (
          <div
            className="absolute top-[calc(100%-2px)] left-0 right-0 z-10 max-h-[300px] overflow-y-auto bg-white rounded-b border border-(--color-primary) border-t-0"
            style={{
              boxShadow: "inherit",
            }}
          >
            {isLoading ? (
              <div className="p-4 text-center">Поиск...</div>
            ) : results ? (
              <div className="px-2 flex flex-col gap-2.5">
                {groupedProducts.length > 0 ? (
                  groupedProducts.map((group) => (
                    <div key={group.category} className="flex flex-col gap-2.5">
                      <Link 
                        href={`/catalog/${encodeURIComponent(group.category)}`} 
                        className="flex items-start gap-x-4 hover:bg-gray-100 py-1"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="flex-1 min-w-0 break-words">
                          <HighlightText
                            text={translateCategory(group.category)}
                            highlight={query}
                          />
                        </div>
                        <Image
                          src={burger}
                          alt={translateCategory(group.category)}
                          width={24}
                          height={24}
                          className="flex-shrink-0"
                        />
                      </Link>

                      <ul className="flex flex-col gap-2.5">
                        {group.products.map((product) => (
                          <li
                            key={product.id}
                            className="hover:bg-gray-100 py-1"
                          >
                            <Link 
                              href={`/product/${product.id}`}
                              className="block break-words"
                              onClick={() => setIsOpen(false)}
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
                  ))
                ) : (
                  <div className="text-gray-500 py-2 px-4 break-words">
                    Ничего не найдено
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 text-gray-500 break-words">
                Введите 2 и более символов для поиска
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}