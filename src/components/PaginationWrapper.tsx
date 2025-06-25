"use client";

import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { CONFIG } from "@/config/config";
import { debounce } from "../../utils/debounce";

function getItemsPerPageByWidth() {
  const width = window.innerWidth;
  if (width < 768) return 2;
  if (width < 1280) return 3;
  return CONFIG.ITEMS_PER_PAGE;
}

export function PaginationWrapper({
  totalItems,
  currentPage,
  basePath,
}: {
  totalItems: number;
  currentPage: number;
  basePath: string;
}) {
  const [itemsPerPage, setItemsPerPage] = useState(CONFIG.ITEMS_PER_PAGE);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const updateItemsPerPage = () => {
      const newItemsPerPage = getItemsPerPageByWidth();
      if (newItemsPerPage === itemsPerPage) return;

      setItemsPerPage(newItemsPerPage);
      
      const params = new URLSearchParams(searchParams.toString());
      params.set("itemsPerPage", newItemsPerPage.toString());
      params.set("page", "1");
      
      router.replace(`${basePath}?${params.toString()}`, { scroll: false });
    };

    updateItemsPerPage();
    const handleResize = debounce(updateItemsPerPage, 200);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [itemsPerPage, searchParams, basePath, router]);

  return (
    <Pagination
      totalItems={totalItems}
      currentPage={currentPage}
      basePath={basePath}
      itemsPerPage={itemsPerPage}
    />
  );
}