"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";

export function ClientPaginationWrapper({
  totalItems,
  currentPage,
  basePath,
  initialItemsPerPage,
}: {
  totalItems: number;
  currentPage: number;
  basePath: string;
  initialItemsPerPage: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // Определяем количество элементов в зависимости от ширины экрана
  const getItemsPerPage = (width: number) => {
    if (width < 768) return 2;
    if (width < 1280) return 3;
    return 4;
  };

  // Объявляем handleResize с useCallback для стабильной ссылки
  const handleResize = useCallback(() => {
    const newItemsPerPage = getItemsPerPage(window.innerWidth);

    if (newItemsPerPage !== itemsPerPage) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("itemsPerPage", newItemsPerPage.toString());
      router.replace(`${basePath}?${params.toString()}`, { scroll: false });
    }
  }, [itemsPerPage, searchParams, router, basePath]);

  // Эффект для подписки на resize
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Синхронизируем состояние с URL параметрами
  useEffect(() => {
    const newItemsPerPage =
      Number(searchParams.get("itemsPerPage")) || initialItemsPerPage;
    setItemsPerPage(newItemsPerPage);
  }, [searchParams, initialItemsPerPage]);

  return (
    <Pagination
      totalItems={totalItems}
      currentPage={currentPage}
      basePath={basePath}
      itemsPerPage={itemsPerPage}
    />
  );
}