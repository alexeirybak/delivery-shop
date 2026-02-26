import { Metadata } from "next";
import { ProductCardProps } from "@/types/product";
import { getProduct } from "../getProduct";
import ProductPageContent from "./ProductPageContent";
import ErrorComponent from "@/components/ErrorComponent";
import { baseUrl } from "../../../../../../../utils/baseUrl";

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

function extractIdFromSlug(slug: string): string {
  const match = slug.match(/^(\d+)/);
  return match ? match[1] : slug;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const { category, slug } = await params;

    const productId = extractIdFromSlug(slug);
    const product = await getProduct(productId);

    const canonicalUrl = `${baseUrl}/catalog/${category}/${slug}`;

    let ogImage = undefined;
    
    if (product.img) {
      if (product.img.startsWith('http://') || product.img.startsWith('https://')) {
        ogImage = product.img;
      } else {
        ogImage = `${baseUrl}${product.img.startsWith('/') ? '' : '/'}${product.img}`;
      }
    } else {
      console.warn('No image found for product');
    }

    return {
      title: product.title,
      description: `Заказывайте ${product.title} по лучшей цене. Быстрая доставка, гарантия качества.`,
      metadataBase: new URL(baseUrl),
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: product.title,
        description: product.description || `Заказывайте ${product.title} по лучшей цене`,
        images: ogImage,
        url: canonicalUrl,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: "Товар",
      description: "Страница товара",
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

  return (
    <ProductPageContent product={product} productId={product.id.toString()} />
  );
};

export default ProductPage;