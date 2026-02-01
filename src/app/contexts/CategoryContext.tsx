"use client";

import { createContext, useContext, ReactNode, useState } from "react";

interface CategoryContextType {
  categoryTitle: string;
  setCategoryTitle: (title: string) => void;
}

const CategoryContext = createContext<CategoryContextType>({
  categoryTitle: "",
  setCategoryTitle: () => {},
});

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categoryTitle, setCategoryTitle] = useState<string>("");
  
  return (
    <CategoryContext.Provider value={{ categoryTitle, setCategoryTitle }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategoryTitles() {
  return useContext(CategoryContext);
}