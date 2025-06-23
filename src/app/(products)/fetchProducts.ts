import { ProductCardProps } from "@/types/product";
import { shuffleArray } from "../../../utils/shuffleArray";

export const fetchProductsByCategory = async (category: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL!}/api/products?category=${category}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) throw new Error(`Ошибка получения продуктов ${category}`);

    const products: ProductCardProps[] = await res.json();
    return shuffleArray(products);
  } catch (err) {
    console.error(`Ошибка при получении продуктов (${category}):`, err);
    throw err;
  }
};
