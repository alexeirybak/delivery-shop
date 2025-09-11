"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchProduct } from "@/types/searchProduct";
import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";

const InputBlock = ({
  onFocusChangeAction,
}: {
  onFocusChangeAction: (focused: boolean) => void;
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groupedProducts, setGroupedProducts] = useState<
    { category: string; products: SearchProduct[] }[]
  >([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
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
          setGroupedProducts(data);
        } catch (error) {
          console.error("Не найден продукт или категория", error);
          setError("Не найден продукт или категория");
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

  const handleInputFocus = () => {
    setIsOpen(true);
    onFocusChangeAction(true);
  };

  const resetSearch = () => {
    setIsOpen(false);
    setQuery("");
  };

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      resetSearch();
    }
  };

  const handleInputBlur = () => {
    onFocusChangeAction(false);
  };

  return (
    <div className="relative min-w-[261px] flex-grow" ref={searchRef}>
      <SearchInput
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
        handleInputFocus={handleInputFocus}
        handleInputBlur={handleInputBlur}
      />

      {isOpen && (
        <div className="absolute -mt-0.5 left-0 right-0 z-100 max-h-[300px] overflow-y-auto bg-white rounded-b border-1 border-primary border-t-0 shadow-inherit break-words">
          {error ? (
            <div className="p-2 text-red-500 text-sm">
              {error}
              <button
                onClick={() => setError(null)}
                className="text-blue-500 hover:text-blue-700 cursor-pointer"
              >
                Повторить
              </button>
            </div>
          ) : (
            <SearchResults
              isLoading={isLoading}
              query={query}
              groupedProducts={groupedProducts}
              resetSearch={resetSearch}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default InputBlock;
