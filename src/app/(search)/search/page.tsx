"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductsSection from "@/components/ProductsSection";
import { ProductCardProps } from "@/types/product";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/search-full?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Поиск: {query}</h1>
        <p>Загрузка результатов...</p>
      </div>
    );
  }

  return (
    <div className="text-[#414141]">
      <h1 className="text-2xl xl:text-4xl text-left font-bold mb-6">
        Результат поиска
      </h1>
      <p>по запросу <span className="text-[#ff6633]">{query}</span></p>
      
      {products.length === 0 ? (
        <p className="text-lg">
          Ничего не найдено по вашему запросу
        </p>
      ) : (
        <ProductsSection
          title=""
          products={products}
          applyIndexStyles={false}
        />
      )}
    </div>
  );
}