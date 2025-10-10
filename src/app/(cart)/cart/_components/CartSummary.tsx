import { formatPrice } from "../../../../../utils/formatPrice";
import Bonuses from "@/app/(catalog)/catalog/[category]/(productPage)/[id]/_components/Bonuses";
import { getFullEnding } from "../../../../../utils/getWordEnding";
import { buttonStyles } from "@/app/styles";
import { useState } from "react";

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
  onCheckout?: () => void;
  isCheckout?: boolean;
}

const CartSummary = ({
  visibleCartItems,
  totalMaxPrice,
  totalDiscount,
  finalPrice,
  totalBonuses,
  isMinimumReached,
  onCheckout,
  isCheckout = false,
}: CartSummaryProps) => {
  const [showPaymentOptions, setShowPaymentOptions] = useState(true);

  const handleCashPayment = () => {
    alert(
      "Заказ успешно оформлен! Вы можете оплатить его при получении курьеру наличными или картой. С Вами свяжутся для подтверждения времени доставки."
    );
    setShowPaymentOptions(false);
  };

  const handleOnlinePayment = () => {
    console.log("Оплата на сайте");
  };

  return (
    <>
      <div className="flex flex-col gap-y-2.5 pb-6 border-b-2 border-[#f3f2f1]">
        <div className="flex flex-row justify-between">
          <p className="text-[#8f8f8f]">
            {visibleCartItems.length}{" "}
            {`товар${getFullEnding(visibleCartItems.length)}`}
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

          {!isCheckout ? (
            <button
              disabled={!isMinimumReached || visibleCartItems.length === 0}
              className={`p-4 rounded mx-auto w-full text-2xl ${
                isMinimumReached && visibleCartItems.length > 0
                  ? buttonStyles.active
                  : buttonStyles.inactive
              }`}
              onClick={onCheckout}
            >
              Оформить заказ
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              {showPaymentOptions ? (
                <>
                  <button
                    disabled={
                      !isMinimumReached || visibleCartItems.length === 0
                    }
                    className={`p-4 rounded w-full text-xl ${buttonStyles.active}`}
                    onClick={handleOnlinePayment}
                  >
                    Оплатить на сайте
                  </button>

                  <button
                    disabled={
                      !isMinimumReached || visibleCartItems.length === 0
                    }
                    className={`p-4 rounded w-full text-base ${"bg-primary hover:shadow-button-default active:shadow-button-active text-white duration-300 cursor-pointer"}`}
                    onClick={handleCashPayment}
                  >
                    Оплатить при получении
                  </button>
                </>
              ) : (
                <div className="text-center p-4 bg-[#e5ffde] text-[#008c49] rounded border border-primary">
                  Заказ оформлен! Ожидайте звонка для подтверждения доставки.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSummary;
