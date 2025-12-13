import Image from "next/image";
import { ProductCardProps } from "@/types/product";
import { formatPrice } from "../../utils/formatPrice";
import StarRating from "./StarRating";
import Link from "next/link";
import { CONFIG } from "../../config/config";
import FavoriteButton from "./FavoriteButton";
import {
  calculateFinalPrice,
  calculatePriceByCard,
} from "../../utils/calcPrices";
import AddToCartButton from "./AddToCartButton";
import IconCart from "./svg/IconCart";
import { TRANSLATIONS } from "../../utils/translations";

const cardDiscountPercent = CONFIG.CARD_DISCOUNT_PERCENT;

interface ExtendedProductCardProps extends ProductCardProps {
  index?: number;
  isAdminOrderPage?: boolean;
}

const ProductCard = ({
  id,
  img,
  description,
  basePrice,
  discountPercent = 0,
  rating,
  categories,
  quantity,
  orderQuantity,
  isLowStock,
  insufficientStock,
  isOrderPage = false,
  isAdminOrderPage,
  index = 0,
}: ExtendedProductCardProps) => {
  const finalPrice = calculateFinalPrice(basePrice, discountPercent);

  const priceByCard = calculatePriceByCard(finalPrice, cardDiscountPercent);

  const showTwoPrices =
    !isOrderPage && discountPercent > 0 && cardDiscountPercent > 0;

  const displayPrice = showTwoPrices ? priceByCard : finalPrice;

  const productId = id;
  const mainCategory = categories?.[0];

  const productUrl = `/catalog/${encodeURIComponent(mainCategory)}/${productId}`;

  const isPriorityImage = index < 4;

  return (
    <div
      className={`relative flex flex-col justify-between w-40 rounded overflow-hidden bg-white md:w-56 xl:w-[272px] ${isAdminOrderPage ? "h-auto" : "h-[349px]"} align-top p-0 hover:shadow-article duration-300`}
    >
      {orderQuantity && (
        <div className="absolute top-2 left-2 text-main-text flex items-center p-1 bg-white bg-opacity-80 rounded justify-center gap-1 text-lg font-bold z-10">
          <IconCart />
          {orderQuantity}
        </div>
      )}

      {(isLowStock || insufficientStock) && (
        <div
          className={`absolute top-2 left-1/2 transform -translate-x-1/2 p-1 rounded text-[8px] md:px-2 md:text-xs z-10 ${
            insufficientStock
              ? "bg-[#d80000] text-white"
              : "bg-[#ff6633] text-white"
          }`}
        >
          {insufficientStock ? "Нет в наличии" : `Осталось: ${quantity}`}
        </div>
      )}
      {!isAdminOrderPage && <FavoriteButton productId={productId.toString()} />}
      <Link href={productUrl}>
        <div className="relative aspect-square w-40 h-40 md:w-56 xl:w-[272px]">
          <Image
            src={img}
            alt="Товар"
            fill
            className="object-contain"
            priority={isPriorityImage}
            sizes="(max-width: 768px) 160px, (max-width: 1280px) 224px, 272px"
          />
          {!isAdminOrderPage && !isOrderPage && discountPercent > 0 && (
            <div className="absolute bg-[#ff6633] py-1 px-2 rounded text-white bottom-2.5 left-2.5">
              -{discountPercent}%
            </div>
          )}
        </div>

        <div
          className={`flex flex-col p-2 ${isAdminOrderPage ? "h-auto" : "h-[189px]"} `}
        >
          {!isAdminOrderPage && (
            <div className="flex flex-row justify-between items-start h-[45px]">
              <div className="flex flex-col gap-x-1">
                <div className="flex flex-row gap-x-1 text-sm md:text-lg font-bold text-main-text">
                  <span>{formatPrice(displayPrice)}</span>
                  <span>₽</span>
                </div>
                {showTwoPrices && (
                  <p className="text-[#bfbfbf] text-[8px] md:text-xs">
                    С картой
                  </p>
                )}
              </div>
              {showTwoPrices && (
                <div className="flex flex-col gap-x-1">
                  <div className="flex flex-row gap-x-1 text-xs md:text-base text-[#606060]">
                    <span>{formatPrice(finalPrice)}</span>
                    <span>₽</span>
                  </div>
                  <p className="text-[#bfbfbf] text-[8px] md:text-xs text-right">
                    Обычная
                  </p>
                </div>
              )}
            </div>
          )}
          {isAdminOrderPage && (
            <div className="text-xs mb-2">{TRANSLATIONS[categories[0]]}</div>
          )}
          <div className="h-13.5 text-xs md:text-base text-main-text line-clamp-3 md:line-clamp-2 leading-normal">
            {description}
          </div>
          {!isAdminOrderPage && <StarRating rating={rating?.rate || 5.0} />}
        </div>
      </Link>
      {!isAdminOrderPage && (
        <AddToCartButton
          productId={productId.toString()}
          availableQuantity={quantity}
        />
      )}
    </div>
  );
};

export default ProductCard;
