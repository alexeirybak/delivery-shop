"use client";

import { useCategory } from "@/app/contexts/CategoryContext";
import { useEffect } from "react";

const CategoryTitle = ({ categoryTitle }: { categoryTitle: string }) => {
  const { setCategoryTitle } = useCategory();
  useEffect(() => {
    setCategoryTitle(categoryTitle);

    return () => {
      setCategoryTitle("");
    };
  }, [categoryTitle, setCategoryTitle]);

  return <h1 className="text-3xl font-bold mb-4">{categoryTitle}</h1>;
};

export default CategoryTitle;
