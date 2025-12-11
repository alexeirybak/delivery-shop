import Image from "next/image";
import { CONFIG } from "../../../../../../../../config/config";
import { formatPrice } from "../../../../../../../../utils/formatPrice";

interface ProductOfferProps {
  discountedPrice: number;
  cardPrice: number;
}

const ProductOffer = ({ discountedPrice, cardPrice }: ProductOfferProps) => {
  return (
    <div className="flex flex-row justify-between gap-2 leading-1.5 h-19 mb-4">
      <div className="flex flex-col justify-end">
        <p className="text-[#606060] text-xl md:text-lg xl:text-2xl mb-1.5">
          {formatPrice(discountedPrice)} ₽
        </p>
        <p className="text-[#bfbfbf] text-[8px] md:text-xs">Обычная цена</p>
      </div>

      <div className="flex flex-col justify-end">
        <p className="text-main-text text-2xl xl:text-4xl font-bold mb-1.5 text-right">
          {formatPrice(cardPrice)} ₽
        </p>
        <div className="flex flex-row gap-x-1 items-center relative">
          <p className="text-[#bfbfbf] text-[8px] md:text-xs">
            С картой Северяночки
          </p>
          <div className="group relative cursor-help">
            <Image
              src="/icons-products/icon-info.svg"
              alt="Информация"
              width={16}
              height={16}
              className="select-none opacity-70"
            />
            <div className="absolute right-0 bottom-full mb-2 w-48 p-3 bg-white border border-gray-200 shadow-lg rounded-md text-xs text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
              Скидка {CONFIG.CARD_DISCOUNT_PERCENT}% по карте лояльности
              «Северяночка». Оформите карту на кассе или закажите с курьером!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOffer;