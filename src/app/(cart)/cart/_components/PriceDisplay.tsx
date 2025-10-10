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
    
  return (
    // Немного изменил, чтобы даже когда товара нет в наличии, показывалась цена
    <>
      <div className="mt-2 text-xs flex gap-x-2 items-baseline">
        {hasDiscount ? (
          <>
            <div className="flex flex-col">
              <span className={`font-bold ${isOutOfStock ? 'text-gray-500' : ''}`}>
                {formatPrice(finalPrice)} ₽
              </span>
              <span className="text-[#bfbfbf]">С картой</span>
            </div>
            <div className="flex flex-col">
              <span className={`text-[#606060] ${isOutOfStock ? 'line-through text-gray-400' : ''}`}>
                {formatPrice(priceWithDiscount)} ₽
              </span>
              <span className="text-[#bfbfbf]">Обычная</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col">
            <span className={`font-bold ${isOutOfStock ? 'text-gray-500' : ''}`}>
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