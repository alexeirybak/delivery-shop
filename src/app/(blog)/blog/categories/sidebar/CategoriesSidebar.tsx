"use client";

import { useState } from "react";
import { CategoriesSidebarProps } from "../types/categories.types";
import FloatingMenuButton from "./FloatingMenuButton";
import SidebarOverlay from "./SidebarOverlay";
import SidebarContent from "./SidebarContent";
import "../css/sidebar-animations.css";

export default function CategoriesSidebar({
  categories,
}: CategoriesSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <FloatingMenuButton
        onClick={() => setIsOpen(true)}
        categoriesCount={categories.length}
      />
      <SidebarOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <SidebarContent
        isOpen={isOpen}
        onCloseAction={() => setIsOpen(false)}
        categories={categories}
      />
    </>
  );
}
