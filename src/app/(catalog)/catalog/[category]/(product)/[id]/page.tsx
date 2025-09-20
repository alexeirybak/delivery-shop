import { Metadata } from "next";
import { ProductCardProps } from "@/types/product";
import { getProduct } from "@/lib/products";
import ProductPageContent from "./ProductPageContent";
import ErrorComponent from "@/components/ErrorComponent";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const product = await getProduct(id);

    return {
      title: `${product.title}`,
      description: `Заказывайте ${product.title} по лучшей цене. Быстрая доставка, гарантия качества.`,
      openGraph: {
        title: product.title,
        description:
          product.description || `Заказывайте ${product.title} по лучшей цене`,
        images: product.img ? [product.img[0]] : [],
      },
    };
  } catch {
    const searchParamsObj = await searchParams;
    const productTitle = decodeURIComponent(String(searchParamsObj.desc));

    return {
      title: `${productTitle}`,
      description: `Заказывайте ${productTitle} по лучшей цене. Быстрая доставка, гарантия качества.`,
    };
  }
}

const ProductPage = async ({ params }: PageProps) => {
  let product: ProductCardProps;
  const productId = (await params).id;

  try {
    product = await getProduct(productId);
  } catch (error) {
    return (
      <ErrorComponent
        error={error instanceof Error ? error : new Error(String(error))}
        userMessage="Не удалось загрузить данные о продукте"
      />
    );
  }

  if (!product) {
    return (
      <ErrorComponent
        error={new Error("Продукт не найден")}
        userMessage="Продукт не найден"
      />
    );
  }

  return <ProductPageContent product={product} productId={productId} />;
};

export default ProductPage;