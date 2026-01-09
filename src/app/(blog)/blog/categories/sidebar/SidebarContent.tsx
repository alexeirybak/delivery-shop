"use client";

import { useState, useEffect, useRef } from "react";
import { SidebarContentProps } from "../types/sidebar.types";
import SidebarHeader from "./SidebarHeader";
import CategoriesList from "./CategoriesList";

export default function SidebarContent({
  isOpen,
  onCloseAction,
  categories,
}: SidebarContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        onCloseAction();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onCloseAction]);

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <SidebarHeader
        categoriesCount={categories.length}
        onClose={onCloseAction}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className="h-[calc(100vh-180px)] overflow-y-auto">
        <div className="p-4">
          <CategoriesList
            categories={filteredCategories}
            searchQuery={searchQuery}
            onItemClick={onCloseAction}
          />
        </div>
      </div>
    </div>
  );
}
