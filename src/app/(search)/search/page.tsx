"use client";

import { Loader } from "@/components/Loader";
import ProductsSection from "@/components/ProductsSection";
import { ProductCardProps } from "@/types/product";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SearchResult = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        console.error("Не удалось получить результаты", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  if (isLoading) return <Loader />;

  return (
    <div className="px-[max(12px,calc((100%-1208px)/2))] text-[#414141] my-20">
      <h1 className="text-2xl xl:text-4xl text-left font-bold mb-6">
        Результат поиска
      </h1>
      <p className="text-sm md:text-base xl:text-2xl mb-6">
        по запросу <span className="text-[#ff6633]">{query}</span>
      </p>
      {products.length === 0 ? (
        <p className="text-lg">По Вашему запросу ничего не найдено</p>
      ) : (
        <ProductsSection title={""} products={products} applyIndexStyles={false}/>
      )}
    </div>
  );
};

export default SearchResult;
