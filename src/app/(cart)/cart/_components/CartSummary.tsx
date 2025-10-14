import { buttonStyles } from "@/app/styles";
import { formatPrice } from "../../../../../utils/formatPrice";
import Bonuses from "@/app/(catalog)/catalog/[category]/(productPage)/[id]/_components/Bonuses";
import { CartSummaryProps } from "../../../../types/cart";
import { getFullEnding } from "../../../../../utils/getWordEnding";
import { useCartStore } from "@/store/cartStore";
import { CONFIG } from "../../../../../config/config";
import { useState } from "react";
import { CartItemWithPrice } from "@/types/order";
import {
  calculateFinalPrice,
  calculatePriceByCard,
} from "../../../../../utils/calcPrices";
import { createOrderAction } from "@/actions/orderDelivery";
import OrderSuccessMessage from "./OrderSuccessMessage";

const CartSummary = ({ deliveryData, productsData = {} }: CartSummaryProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const {
    pricing,
    cartItems,
    hasLoyaltyCard,
    isCheckout,
    setIsCheckout,
    isOrdered,
    setIsOrdered,
  } = useCartStore();

  const visibleCartItems = cartItems.filter((item) => item.quantity > 0);

  const {
    totalPrice,
    totalMaxPrice,
    totalDiscount,
    finalPrice,
    totalBonuses,
    maxBonusUse,
    isMinimumReached,
  } = pricing;

  const usedBonuses = Math.min(
    maxBonusUse,
    Math.floor((totalPrice * CONFIG.MAX_BONUSES_PERCENT) / 100)
  );

  const handleCashPayment = async () => {
    if (!deliveryData) {
      console.error("Данные доставки не заполнены");
      return;
    }

    setIsProcessing(true);

    try {
      const cartItemsWithPrices: CartItemWithPrice[] = visibleCartItems.map(
        (item) => {
          const product = productsData[item.productId];

          if (!product) {
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: 0,
            };
          }

          const priceWithDiscount = calculateFinalPrice(
            product.basePrice,
            product.discountPercent || 0
          );

          const finalPrice = hasLoyaltyCard
            ? calculatePriceByCard(
                priceWithDiscount,
                CONFIG.CARD_DISCOUNT_PERCENT
              )
            : priceWithDiscount;

          return {
            productId: item.productId,
            quantity: item.quantity,
            price: finalPrice,
            basePrice: product.basePrice,
            discountPercent: product.discountPercent || 0,
            hasLoyaltyDiscount: hasLoyaltyCard,
          };
        }
      );

      const result = await createOrderAction({
        finalPrice,
        totalBonuses,
        usedBonuses,
        totalDiscount,
        deliveryAddress: deliveryData.address,
        deliveryTime: deliveryData.time,
        cartItems: cartItemsWithPrices,
        totalPrice: totalMaxPrice,
        paymentMethod: "cash_on_delivery",
      });

      setOrderNumber(result.orderNumber);
      setIsOrdered(true);
    } catch (error: unknown) {
      console.error("Ошибка при создании заказа:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Произошла неизвестная ошибка";
      alert(`Ошибка при оформлении заказа: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOnlinePayment = () => {
    if (!deliveryData) {
      console.error("Данные доставки не заполнены");
      return;
    }
    console.log("Оплата на сайте");
  };

  const isFormValid = (): boolean => {
    if (!deliveryData) {
      return false;
    }

    const { address, time } = deliveryData;

    // Проверяем обязательные поля адреса
    const isAddressValid = Boolean(
      address.city?.trim() && address.street?.trim() && address.house?.trim()
    );

    // Проверяем время доставки
    const isTimeValid = Boolean(time.date?.trim() && time.timeSlot?.trim());

    // Используем отфильтрованные товары
    const isValidForm =
      isAddressValid &&
      isTimeValid &&
      isMinimumReached &&
      visibleCartItems.length > 0;

    return isValidForm;
  };

  const canProceedWithPayment = (): boolean => {
    return isFormValid() && !isProcessing;
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
            <div className="bg-[#d80000] rounded text-white text-xs text-center mx-auto py-0.75 px-1.5 mb-4 w-full">
              Минимальная сумма заказа 1000р
            </div>
          )}
          {!isCheckout ? (
            <button
              onClick={() => setIsCheckout(true)}
              disabled={!isMinimumReached || visibleCartItems.length === 0}
              className={`p-3 rounded mx-auto w-full text-2xl cursor-pointer ${
                isMinimumReached && visibleCartItems.length > 0
                  ? buttonStyles.active
                  : buttonStyles.inactive
              }`}
            >
              Оформить заказ
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              {!isOrdered ? (
                <>
                  <button
                    disabled={!canProceedWithPayment()}
                    onClick={handleOnlinePayment}
                    className={`rounded w-full text-xl h-15 items-center justify-center ${
                      canProceedWithPayment()
                        ? buttonStyles.active
                        : buttonStyles.inactive
                    }`}
                  >
                    {isProcessing ? "Обработка..." : "Оплатить на сайте"}
                  </button>

                  <button
                    disabled={!canProceedWithPayment()}
                    onClick={handleCashPayment}
                    className={`h-10 rounded w-full text-base items-center justify-center duration-300 ${
                      canProceedWithPayment()
                        ? "bg-primary hover:shadow-button-default active:shadow-button-active text-white cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isProcessing ? "Оформление..." : "Оплатить при получении"}
                  </button>
                </>
              ) : (
                <OrderSuccessMessage orderNumber={orderNumber}/>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSummary;
