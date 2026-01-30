"use client";

import { useArticle } from "@/app/contexts/ArticleContext";
import { useCategory } from "@/app/contexts/CategoryContext";
import { useEffect } from "react";
import { ArticleTitleProps } from "../../../types";

const ArticleTitle = ({ articleTitle, categoryName }: ArticleTitleProps) => {
  const { setArticleTitle } = useArticle();
  const { setCategoryTitle } = useCategory();

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
