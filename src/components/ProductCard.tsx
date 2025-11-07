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

const cardDiscountPercent = CONFIG.CARD_DISCOUNT_PERCENT;

// Расширяем интерфейс для нового пропса
interface ExtendedProductCardProps extends ProductCardProps {
  isOrderPage?: boolean;
}

const ProductCard = ({
  id,
  img,
  description,
  basePrice,
  discountPercent = 0,
  rating,
  tags,
  categories,
  quantity,
  orderQuantity,
  isLowStock,
  insufficientStock,
  isOrderPage = false, // Новый пропс
}: ExtendedProductCardProps) => {
  const isNewProduct = tags?.includes("new");

  // Если это страница заказов, не применяем скидку по карте лояльности
  const finalPrice = isNewProduct
    ? basePrice
    : calculateFinalPrice(basePrice, discountPercent);

  const priceByCard = isOrderPage 
    ? finalPrice // На странице заказов показываем фактически уплаченную цену
    : isNewProduct
    ? basePrice
    : calculatePriceByCard(finalPrice, cardDiscountPercent);

  const productId = id;
  const mainCategory = categories?.[0];

  const productUrl = `/catalog/${encodeURIComponent(mainCategory)}/${productId}?desc=${encodeURIComponent(description.substring(0, 50))}`;

  return (
    <div className="relative flex flex-col justify-between w-40 rounded overflow-hidden bg-white md:w-[224px] xl:w-[272px] h-[349px] align-top p-0 hover:shadow-(--shadow-article) duration-300">
      {/* Количество в заказе */}
      {orderQuantity && (
        <div className="absolute top-2 left-2 text-main-text flex flex-col md:flex-row items-center justify-center gap-1 text-lg font-bold z-10">
          <IconCart />
          {orderQuantity}
        </div>
      )}

      {/* Статус количества на складе - показываем только при проблемах */}
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

      <FavoriteButton productId={productId.toString()} />

      <Link href={productUrl}>
        <div className="relative aspect-square w-40 h-40 md:w-[224px] xl:w-[272px]">
          <Image
            src={img}
            alt="Товар"
            fill
            className="object-contain"
            priority={false}
            sizes="(max-width: 768px) 160px, (max-width: 1280px) 224px, 272px"
          />
          {!isOrderPage && discountPercent > 0 && (
            <div className="absolute bg-[#ff6633] py-1 px-2 rounded text-white bottom-2.5 left-2.5">
              -{discountPercent}%
            </div>
          )}
        </div>

        <div className="flex flex-col p-2 h-[189px]">
          <div className="flex flex-row justify-between items-start h-[45px]">
            <div className="flex flex-col gap-x-1">
              <div className="flex flex-row gap-x-1 text-sm md:text-lg font-bold text-main-text">
                <span>{formatPrice(priceByCard)}</span>
                <span>₽</span>
              </div>
              {discountPercent > 0 && !isOrderPage && (
                <p className="text-[#bfbfbf] text-[8px] md:text-xs">С картой</p>
              )}
            </div>
            {/* Скрываем блок "Обычная цена" на странице заказов */}
            {!isOrderPage && finalPrice !== basePrice && cardDiscountPercent > 0 && (
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
          <div className="h-13.5 text-xs md:text-base text-main-text line-clamp-3 md:line-clamp-2 leading-[1.5]">
            {description}
          </div>
          <StarRating rating={rating?.rate || 5.0} />
        </div>
      </Link>

      <AddToCartButton
        productId={productId.toString()}
        disabled={insufficientStock}
        availableQuantity={quantity}
        status={insufficientStock ? "out-of-stock" : "low-stock"}
      />
    </div>
  );
};

export default ProductCard;