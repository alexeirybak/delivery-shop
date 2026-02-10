"use client";

import { useCategoryTitles } from "@/app/contexts/CategoryContext";
import { useEffect } from "react";
import { ArticleTitleProps } from "../../../types";
import { useArticleTitles } from "@/app/contexts/ArticleContext";

const ArticleTitle = ({ articleTitle, categoryName }: ArticleTitleProps) => {
  const { setArticleTitle } = useArticleTitles();
  const { setCategoryTitle } = useCategoryTitles();

  useEffect(() => {
    setArticleTitle(articleTitle);

    if (categoryName) {
      setCategoryTitle(categoryName);
    }

    return () => {
      setArticleTitle("");
      setCategoryTitle("");
    };
  }, [articleTitle, categoryName, setArticleTitle, setCategoryTitle]);

  return <h1 className="text-3xl font-bold mb-4">{articleTitle}</h1>;
};

export default ArticleTitle;