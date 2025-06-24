"use client";

import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";

export function ClientPaginationWrapper({
  totalItems,
  currentPage,
  basePath,
}: {
  totalItems: number;
  currentPage: number;
  basePath: string;
}) {
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setItemsPerPage(2);
      else if (width < 1280) setItemsPerPage(3);
      else setItemsPerPage(4);
    };

    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Pagination
      totalItems={totalItems}
      currentPage={currentPage}
      basePath={basePath}
      itemsPerPage={itemsPerPage}
    />
  );
}