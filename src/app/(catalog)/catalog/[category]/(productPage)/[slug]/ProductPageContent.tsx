import { ProductCardProps } from "@/types/product";
import { CONFIG } from "../../../../../../../config/config";
import {
  calculateFinalPrice,
  calculatePriceByCard,
} from "../../../../../../../utils/calcPrices";
import StarRating from "@/components/StarRating";
import ShareButton from "./_components/ShareButton";
import ImagesBlock from "./_components/ImagesBlock";
import ProductOffer from "./_components/ProductOffer";
import CartButton from "./_components/CartButton";
import Bonuses from "./_components/Bonuses";
import DiscountMessage from "./_components/DiscountMessage";
import AdditionalInfo from "./_components/AdditionalInfo";
import SimilarProducts from "./_components/SimilarProducts";
import SameBrandProducts from "./_components/SameBrandProducts";
import RatingDistribution from "./_components/RatingDistribution";
import ReviewsWrapper from "./_components/ReviewsWrapper";
import Actions from "@/app/(products)/Actions";
import FavoriteButton from "@/components/FavoriteButton";
import { getFullEnding } from "../../../../../../../utils/getWordEnding";
import ProductTitle from "./_components/ProductTitle";

interface ProductPageContentProps {
  product: ProductCardProps;
  productId: string;
}

const ProductPageContent = ({
  product,
  productId,
}: ProductPageContentProps) => {
  const priceWithDiscount = calculateFinalPrice(
    product.basePrice,
    product.discountPercent || 0
  );

  const cardPrice = calculatePriceByCard(
    priceWithDiscount,
    CONFIG.CARD_DISCOUNT_PERCENT
  );

  const bonusesAmount = Math.round(
    (priceWithDiscount * CONFIG.BONUSES_PERCENT) / 100
  );

  return (
    <div className="px-[max(12px,calc((100%-1208px)/2))] md:px-[max(16px,calc((100%-1208px)/2))] text-main-text">
      <ProductTitle title={product.title} description={product.description} />
      <div className="flex flex-row flex-wrap items-center gap-6 mb-4 md:mb-6">
        <div className="text-xs">арт. {product.article}</div>
        <div className="flex flex-row flex-wrap gap-2 items-center">
          <StarRating rating={product.rating.rate || 5} />
          <p className="text-sm underline">
            {product.rating.count || 0}{" "}
            {`отзыв${getFullEnding(product.rating.count || 0)}`}
          </p>
        </div>
        <ShareButton title={product.title} />
        <FavoriteButton productId={productId} />
      </div>
      <div className="flex flex-col gap-y-25 md:gap-y-20 xl:gap-y-30">
        <div className="flex flex-col md:flex-row md:flex-wrap gap-10 w-full justify-center">
          <ImagesBlock product={product} />
          <div className="md:w-[344px] lg:w-[376px] flex flex-col">
            <ProductOffer
              discountedPrice={priceWithDiscount}
              cardPrice={cardPrice}
            />
            <CartButton productId={productId} />
            <Bonuses bonus={bonusesAmount} />
            <DiscountMessage
              productId={productId.toString()}
              productTitle={product.title}
              currentPrice={priceWithDiscount.toString()}
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
            <RatingDistribution
              averageRating={product.rating.rate}
              distribution={product.rating.distribution}
            />
            <ReviewsWrapper productId={productId} />
          </div>
        </div>
        <Actions randomLimit={6} mobileItemsLimit={6} />
      </div>
    </div>
  );
};

export default ProductPageContent;
