import { memo } from "react";
import { formatPrice } from "../../../../../utils/formatPrice";

interface PriceDisplayProps {
  finalPrice: number;
  priceWithDiscount: number;
  totalFinalPrice: number;
  totalPriceWithoutCard: number;
  hasDiscount: boolean;
  hasLoyaltyCard: boolean;
  isOutOfStock: boolean;
}

const PriceDisplay = memo(function PriceDisplay({
  finalPrice,
  priceWithDiscount,

  hasDiscount,
  isOutOfStock
}: PriceDisplayProps) {
  if (isOutOfStock) {
    return <span className="font-normal text-base flex">Нет в наличии</span>;
  }

  return (
    <>
      <div className="mt-2 text-xs flex gap-x-2 items-baseline">
        {hasDiscount ? (
          <>
            <div className="flex flex-col">
              <span className="font-bold">{formatPrice(finalPrice)} ₽</span>
              <span className="text-[#bfbfbf]">С картой</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[#606060]">
                {formatPrice(priceWithDiscount)} ₽
              </span>
              <span className="text-[#bfbfbf]">Обычная</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col">
            <span className="font-bold">
              {formatPrice(priceWithDiscount)} ₽
            </span>
          </div>
        )}
        <span className="text-[#bfbfbf]">за шт.</span>
      </div>
    </>
  );
});

export default PriceDisplay;