"use client";

import { createContext, useContext, ReactNode, useState } from "react";

interface ArticleContextType {
  articleTitle: string;
  categoryTitle: string;
  setArticleTitle: (title: string) => void;
  setCategoryTitle: (title: string) => void;
}

const ArticleContext = createContext<ArticleContextType>({
  articleTitle: "",
  categoryTitle: "",
  setArticleTitle: () => {},
  setCategoryTitle: () => {},
});

export function ArticleProvider({ children }: { children: ReactNode }) {
  const [articleTitle, setArticleTitle] = useState<string>("");
  const [categoryTitle, setCategoryTitle] = useState<string>("");


  return (
    <ArticleContext.Provider value={{ 
      articleTitle, 
      categoryTitle, 
      setArticleTitle, 
      setCategoryTitle 
    }}>
      {children}
    </ArticleContext.Provider>
  );
}

export function useArticleTitles() {
  const context = useContext(ArticleContext);
  return context;
}