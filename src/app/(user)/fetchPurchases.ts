import { ProductCardProps } from "@/types/product";

export const fetchPurchases = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL!}/api/users/purchases`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) throw new Error("Ошибка получения покупок");

    const purchases: ProductCardProps[] = await res.json();
    console.log(purchases);
    return purchases;
  } catch (err) {
    console.error(`Ошибка при получении покупок:`, err);
    throw err;
  }
};
