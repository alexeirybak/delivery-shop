import { ProductCardProps } from "@/types/product";

const fetchPurchases = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/purchases`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`Серверная ошибка получения покупок`);

    const purchases: ProductCardProps[] = await res.json();

    return purchases;
  } catch (err) {
    console.error("Ошибка получения покупок:", err);
    throw err;
  }
};

export default fetchPurchases;
