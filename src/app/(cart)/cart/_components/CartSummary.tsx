import { formatPrice } from "../../../../../utils/formatPrice";
import { getFullEnding } from "../../../../../utils/getWordEnding";
import { buttonStyles } from "@/app/styles";
import { useState } from "react";
import { createOrderAction } from "@/actions/orderDelivery";
import { CartSummaryProps } from "@/types/cart";
import { CartItemWithPrice } from "@/types/order";
import Bonuses from "@/app/(catalog)/catalog/[category]/(productPage)/[id]/_components/Bonuses";
import { useRouter } from "next/navigation";
import { CONFIG } from "../../../../../config/config";
import { useCartStore } from "@/store/cartStore";
import {
  calculateFinalPrice,
  calculatePriceByCard,
} from "../../../../../utils/calcPrices";
import OrderSuccessMessage from "./OrderSuccessMessage";

const CartSummary = ({ deliveryData, productsData = {} }: CartSummaryProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const router = useRouter();

  const {
    pricing,
    cartItems,
    isCheckout,
    isOrdered,
    setIsOrdered,
    hasLoyaltyCard,
    setIsCheckout,
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

  // Функция проверки валидности формы
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

  const handleOnlinePayment = () => {
    if (!isFormValid()) {
      console.error("Форма доставки невалидна");
      return;
    }

    console.log("Оплата на сайте");
  };

  const handleCashPayment = async () => {
    if (!isFormValid()) {
      console.error("Форма доставки невалидна");
      return;
    }

    if (!deliveryData) {
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

      // Создаем заказ с оплатой при получении
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

  const handleNewOrder = () => {
    setIsOrdered(false);
    setOrderNumber(null);
    router.replace("/");
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
              onClick={() => setIsCheckout(true)}
            >
              Оформить заказ
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              {!isOrdered ? (
                <>
                  <button
                    disabled={!canProceedWithPayment}
                    className={`rounded w-full text-xl h-15 items-center justify-center ${
                      canProceedWithPayment()
                        ? buttonStyles.active
                        : buttonStyles.inactive
                    }`}
                    onClick={handleOnlinePayment}
                  >
                    {isProcessing ? "Обработка..." : "Оплатить на сайте"}
                  </button>

                  <button
                    disabled={!canProceedWithPayment}
                    className={`h-10 rounded w-full text-base items-center justify-center duration-300 ${
                      canProceedWithPayment()
                        ? "bg-primary hover:shadow-button-default active:shadow-button-active text-white cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={handleCashPayment}
                  >
                    {isProcessing ? "Оформление..." : "Оплатить при получении"}
                  </button>
                </>
              ) : (
                <OrderSuccessMessage
                  orderNumber={orderNumber}
                  onNewOrder={handleNewOrder}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSummary;
