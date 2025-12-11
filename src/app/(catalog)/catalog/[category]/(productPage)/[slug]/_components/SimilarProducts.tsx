import Image from "next/image";
import Link from "next/link";
import { ProductCardProps } from "@/types/product";

interface SimilarProductsProps {
  currentProduct: ProductCardProps;
}

interface SimilarProduct {
  id: string;
  title: string;
  img: string;
  basePrice: number;
  discountPercent: number;
  categories: string[];
}

const SimilarProducts = async ({ currentProduct }: SimilarProductsProps) => {
  try {
    const category = currentProduct.categories[0];

    if (!category) return null;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/similar-products?productId=${currentProduct.id}&category=${category}&limit=4`,
      {
        next: { revalidate: 3600 }
      }
    );

    if (!response.ok) {
      throw new Error('Не удалось получить похожие продукты');
    }

    const data = await response.json();
    const similarProducts: SimilarProduct[] = data.similarProducts;

    if (similarProducts.length === 0) {
      return null;
    }

    const calculatePrice = (product: SimilarProduct) => {
      const discount = product.basePrice * (product.discountPercent / 100);
      return product.basePrice - discount;
    };

    return (
      <div className="mx-auto flex flex-col items-center">
        <div className="w-full max-w-[328px] md:max-w-[688px] xl:max-w-[168px]">
          <h3 className="text-sm md:text-lg font-semibold mb-2 text-[#606060] text-left">
            Похожие
          </h3>
        </div>

        <div className="flex flex-row xl:flex-col gap-2 md:gap-4 justify-center xl:justify-start">
          {similarProducts.map((product) => (
            <Link
              key={product.id}
              href={`/catalog/product/${product.id}`}
              className="text-main-text text-sm md:text-lg flex flex-col w-[78px] h-[62px] md:w-[172px] md:h-[158px] xl:w-[168px] xl:h-[104px] rounded bg-white shadow-image-block duration-300 hover:shadow-lg"
            >
              <div className="relative w-full h-[25px] md:h-[111px] xl:h-[57px] flex-shrink-0">
                <Image
                  src={product.img}
                  alt={product.title}
                  fill
                  className="object-contain rounded"
                  sizes="(max-width: 768px) 78px, (max-width: 1280px) 172px, 168px"
                />
              </div>
              <div className="flex items-center font-bold p-2 md:p-2.5">
                {calculatePrice(product)} ₽
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching similar products:", error);
    return null;
  }
};

export default SimilarProducts;