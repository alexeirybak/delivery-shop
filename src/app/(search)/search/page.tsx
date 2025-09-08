"use client";

import ErrorComponent from "@/components/ErrorComponent";
import { Loader } from "@/components/Loader";
import ProductsSection from "@/components/ProductsSection";
import { ProductCardProps } from "@/types/product";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const SearchPage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <SearchResult />
    </Suspense>
  );
};

const SearchResult = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/search-full?query=${encodeURIComponent(query)}`
        );

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError({
          error:
            error instanceof Error ? error : new Error("Неизвестная ошибка"),
          userMessage: "Не удалось загрузить результаты поиска",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <ErrorComponent error={error.error} userMessage={error.userMessage} />
    );
  }

  return (
    <div className="px-[max(12px,calc((100%-1208px)/2))] text-main-text my-20">
      <h1 className="text-2xl xl:text-4xl text-left font-bold mb-6">
        Результат поиска
      </h1>
      <p className="text-sm md:text-base xl:text-2xl mb-6">
        по запросу <span className="text-[#ff6633]">{query}</span>
      </p>
      {products.length === 0 ? (
        <p className="text-lg">По Вашему запросу ничего не найдено</p>
      ) : (
        <ProductsSection
          title={""}
          products={products}
          applyIndexStyles={false}
        />
      )}
    </div>
  );
};

export default SearchPage;
