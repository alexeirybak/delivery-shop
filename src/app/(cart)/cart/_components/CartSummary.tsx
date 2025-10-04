import { buttonStyles } from "@/app/styles";
import { formatPrice } from "../../../../../utils/formatPrice";
import { getGoodsWord } from "../../../../../utils/goodsWord";
import Bonuses from "@/app/(catalog)/catalog/[category]/(productPage)/[id]/_components/Bonuses";

interface CartItem {
  productId: string;
  addedAt: Date;
  quantity: number;
}

interface CartSummaryProps {
  visibleCartItems: CartItem[];
  totalMaxPrice: number;
  totalDiscount: number;
  finalPrice: number;
  totalBonuses: number;
  isMinimumReached: boolean;
}

const CartSummary = ({
  visibleCartItems,
  totalMaxPrice,
  totalDiscount,
  finalPrice,
  totalBonuses,
  isMinimumReached,
}: CartSummaryProps) => {
  return (
    <>
      <div className="flex flex-col gap-y-2.5 pb-6 border-b-2 border-[#f3f2f1]">
        <div className="flex flex-row justify-between">
          <p className="text-[#8f8f8f]">
            {visibleCartItems.length} {getGoodsWord(visibleCartItems.length)}
          </p>
          <p className="">{formatPrice(totalMaxPrice)} ₽</p>
        </div>

        <div className="flex flex-row justify-between">
          <p className="text-[#8f8f8f]">Скидка</p>
          <p className="text-[#ff6633] font-bold">
            -{formatPrice(totalDiscount)} ₽
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between gap-y-6">
        <div className="text-base text-[#8f8f8f] flex flex-row justify-between items-center w-full">
          <span>Итог:</span>
          <span className="font-bold text-2xl text-main-text">
            {formatPrice(finalPrice)} ₽
          </span>
        </div>
        <Bonuses bonus={totalBonuses} />
        <div className="w-full">
          {!isMinimumReached && (
            <div className="bg-[#d80000] rounded text-white text-xs text-center mx-auto py-0.75 px-2 mb-4">
              Минимальная сумма заказа 1000 ₽
            </div>
          )}

          <button
            disabled={!isMinimumReached || visibleCartItems.length === 0}
            className={`p-4 rounded mx-auto w-full text-2xl ${
              isMinimumReached && visibleCartItems.length > 0
                ? buttonStyles.active
                : buttonStyles.inactive
            }`}
          >
            Оформить заказ
          </button>
        </div>
      </div>
    </>
  );
};

export default CartSummary;
