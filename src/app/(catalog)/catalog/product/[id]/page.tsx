import { Metadata } from "next";
import ErrorComponent from "@/components/ErrorComponent";
import StarRating from "@/components/StarRating";
import ReviewsWrapper from "./_components/ReviewsWrapper";
import Image from "next/image";
import RatingDistribution from "./_components/RatingDistribution";
import { getReviewsWord } from "../../../../../../utils/reviewsWord";
import ShareButton from "./_components/ShareButton";
import ImagesBlock from "./_components/ImagesBlock";
import ProductOffer from "./_components/ProductOffer";
import CartButton from "./_components/CartButton";
import Bonuses from "./_components/Bonuses";
import { CONFIG } from "../../../../../../config/config";
import DiscountMessage from "./_components/DiscountMessage";
import AdditionalInfo from "./_components/AdditionalInfo";
import SimilarProducts from "./_components/SimilarProducts";
import { ProductCardProps } from "@/types/product";
import SameBrandProducts from "./_components/SameBrandProducts";
import { getProduct } from "@/lib/products";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Динамические метаданные
export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const product = await getProduct(id);
    
    return {
      title: `${product.title}`,
      description: `Заказывайте ${product.title} по лучшей цене. Быстрая доставка, гарантия качества.`,
      openGraph: {
        title: product.title,
        description: product.description || `Заказывайте ${product.title} по лучшей цене`,
        images: product.img ? [product.img[0]] : [],
      },
    };
  } catch {
    const searchParamsObj = await searchParams;
    const productTitle = decodeURIComponent(String(searchParamsObj.desc));
    
    return {
      title: `${productTitle}`,
      description: `Заказывайте ${productTitle} по лучшей цене. Быстрая доставка, гарантия качества.`
    };
  }
}

const ProductPage = async ({ params }: PageProps) => {
  let product: ProductCardProps;
  const  productId = (await params).id;

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

  const discountedPrice = product.discountPercent
    ? product.basePrice * (1 - product.discountPercent / 100)
    : product.basePrice;

  const cardPrice = discountedPrice * (1 - CONFIG.CARD_DISCOUNT_PERCENT / 100);
  const bonusesAmount = cardPrice * 0.05;

  return (
    <div className="px-[max(12px,calc((100%-1208px)/2))] md:px-[max(16px,calc((100%-1208px)/2))] text-main-text">
      <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
      <div className="flex flex-col gap-y-25 md:gap-y-20 xl:gap-y-30">
        <div className="flex flex-row flex-wrap items-center gap-6 mb-4 md:mb-6">
          <div className="text-xs">арт. {product.article}</div>
          <div className="flex flex-row flex-wrap gap-2 items-center">
            <StarRating rating={product.rating.average || 5} />
            <p className="text-sm underline">
              {product.rating.count || 0}{" "}
              {getReviewsWord(product.rating.count || 0)}
            </p>
          </div>
          <ShareButton title={product.title} />
          <button className="flex flex-row flex-wrap gap-2 items-center cursor-pointer">
            <Image
              src="/icons-header/icon-heart.svg"
              alt="Избранное"
              width={24}
              height={24}
              className="select-none"
            />
            <p className="text-sm">В избранное</p>
          </button>
        </div>
        <div className="flex flex-col md:flex-row md:flex-wrap gap-10 w-full justify-center">
          <ImagesBlock product={product} />

          <div className="md:w-[344px] lg:w-[376px] flex flex-col">
            <ProductOffer
              discountedPrice={discountedPrice}
              cardPrice={cardPrice}
            />
            <CartButton />
            <Bonuses bonus={bonusesAmount} />
            <DiscountMessage
              productId={product.id.toString()}
              productTitle={product.title}
              currentPrice={discountedPrice}
            />
            <AdditionalInfo
              brand={product.brand}
              manufacturer={product.manufacturer}
              weight={product.weight}
            />
          </div>
          <SimilarProducts currentProduct={product} />
        </div>
        <SameBrandProducts currentProduct={product} />
        <div>
          <h2 className="text-2xl xl:text-4xl text-left font-bold text-main-text mb-4 md:mb-8 xl:mb-10">
            Отзывы
          </h2>
          <div className="flex flex-col md:flex-row flex-wrap gap-4 md:gap-x-8 xl:gap-x-36">
            <RatingDistribution distribution={product.rating.distribution} />
            <ReviewsWrapper productId={productId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;