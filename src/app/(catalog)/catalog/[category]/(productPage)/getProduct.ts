import { ProductCardProps } from "@/types/product";

export async function getProduct(id: string): Promise<ProductCardProps> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const product = await response.json();
    return product;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    throw error;
  }
}
