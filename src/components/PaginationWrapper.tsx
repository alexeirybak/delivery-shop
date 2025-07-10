"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CONFIG } from "../../config/config";
import { debounce } from "../../utils/debounce";
import Pagination from "./Pagination";

function getItemsPerPageByWidth(contentType?: string) {
  const width = window.innerWidth;

  if (contentType === "article") {
    return width < 640 ? 1 : 3;
  }

  if (contentType === "category") {
    return width < 768 ? 8 : 6;
  }

  if (width < 768) return 2;
  if (width < 1280) return 3;
  return 4;
}
const PaginationWrapper = ({
  totalItems,
  currentPage,
  basePath,
  contentType,
}: {
  totalItems: number;
  currentPage: number;
  basePath: string;
  contentType?: string;
}) => {
  let initialItemsPerPage;

  if (contentType === "article") {
    initialItemsPerPage = 1;
  } else if (contentType === "category") {
    initialItemsPerPage = CONFIG.ITEMS_PER_PAGE_CATEGORY;
  } else {
    initialItemsPerPage = CONFIG.ITEMS_PER_PAGE;
  }

  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const updateItemsPerPage = () => {
      const newItemsPerPage = getItemsPerPageByWidth(contentType);

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
  }, [itemsPerPage, searchParams, basePath, router, contentType]);
  return (
    <>
      <Pagination
        totalItems={totalItems}
        currentPage={currentPage}
        basePath={basePath}
        itemsPerPage={itemsPerPage}
        searchQuery={searchParams.toString()}
      />
    </>
  );
};

export default PaginationWrapper;
