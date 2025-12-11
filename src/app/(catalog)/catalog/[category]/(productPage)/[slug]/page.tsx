import { Metadata } from "next";
import { ProductCardProps } from "@/types/product";
import { getProduct } from "../getProduct"; // Путь может измениться
import ProductPageContent from "./ProductPageContent";
import ErrorComponent from "@/components/ErrorComponent";

interface PageProps {
  params: Promise<{
    category: string; // Будет "fruit"
    slug: string; // Будет "46-salat-aysberg"
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Функция для извлечения ID из slug
function extractIdFromSlug(slug: string): string {
  const match = slug.match(/^(\d+)/);
  return match ? match[1] : slug;
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const { category, slug } = await params;

    // Извлекаем ID для получения данных
    const productId = extractIdFromSlug(slug);
    const product = await getProduct(productId);

    // Текущий URL уже канонический!
    const canonicalUrl = `${baseUrl}/catalog/${category}/${slug}`;

    return {
      title: `${product.title}`,
      description: `Заказывайте ${product.title} по лучшей цене. Быстрая доставка, гарантия качества.`,
      metadataBase: new URL(baseUrl),
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: product.title,
        description:
          product.description || `Заказывайте ${product.title} по лучшей цене`,
        images: product.img ? [product.img[0]] : [],
        url: canonicalUrl,
      },
    };
  } catch {
    const searchParamsObj = await searchParams;
    const productTitle = decodeURIComponent(String(searchParamsObj.desc));

    return {
      title: `${productTitle}`,
      description: `Заказывайте ${productTitle} по лучшей цене. Быстрая доставка, гарантия качества.`,
      metadataBase: new URL(baseUrl),
    };
  }
}

const ProductPage = async ({ params }: PageProps) => {
  let product: ProductCardProps;
  try {
    const { slug } = await params;
    const productId = extractIdFromSlug(slug);
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

  // Передаем реальный ID, а не slug
  return (
    <ProductPageContent product={product} productId={product.id.toString()} />
  );
};

export default ProductPage;
