import { ProductCardProps } from "@/types/product";

const fetchProductsByCategory = async (category: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products?category=${category}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok)
      throw new Error(`Серверная ошибка получения продуктов ${category}`);

    const products: ProductCardProps[] = await res.json();

    const availableProducts = products.filter(
      (product) => product.quantity > 0
    );

    return availableProducts;
  } catch (err) {
    console.error(`Ошибка в компоненте: ${category}`, err);
    throw err;
  }
};

export default fetchProductsByCategory;
