"use client";

import { useProduct } from "@/app/contexts/ProductContext";
import { useEffect } from "react";

interface ProductTitleProps {
  title: string;
  description: string;
}

const ProductTitle = ({ title, description }: ProductTitleProps) => {
  const { setTitle } = useProduct();
  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);
  return <h1 className="text-xl md:text-2xl font-bold mb-4">{description}</h1>;
};

export default ProductTitle;
