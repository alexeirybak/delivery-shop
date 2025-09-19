import { ProductCardProps } from "@/types/product";
import ProductsSection from "@/components/ProductsSection";

interface SameBrandProductsProps {
  currentProduct: ProductCardProps;
}

const SameBrandProducts = async ({ currentProduct }: SameBrandProductsProps) => {

  const fetchSameBrandProducts = async (): Promise<ProductCardProps[]> => {
    try {
      if (!currentProduct.brand) return [];

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/brand/${encodeURIComponent(currentProduct.brand)}`,
        {
          next: { revalidate: 3600 },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch brand products: ${response.status}`);
      }

      const brandProducts = await response.json();
      
      return brandProducts
        .filter((product: ProductCardProps) => product.id !== currentProduct.id)
        .slice(0, 4);

    } catch (error) {
      console.error('Error fetching same brand products:', error);
      return [];
    }
  };

  const sameBrandProducts = await fetchSameBrandProducts();

  if (!sameBrandProducts || sameBrandProducts.length === 0) {
    return null;
  }

  return (
    <ProductsSection
      title="С этим товаром покупают"
      products={sameBrandProducts}
    />
  );
};

export default SameBrandProducts;