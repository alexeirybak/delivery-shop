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

const CartSummary = ({
  onCheckout,
  deliveryData,
  productsData = {},
}: CartSummaryProps) => {
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
  } = useCartStore();

  // Фильтруем товары с количеством > 0 на фронтенде
  const validCartItems = cartItems.filter(item => item.quantity > 0);

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
      isAddressValid && isTimeValid && isMinimumReached && validCartItems.length > 0;

    return isValidForm;
  };

  const canProceedWithPayment = (): boolean => {
    return isFormValid() && !isProcessing;
  };

  const handleCashPayment = async () => {
    if (!isFormValid()) {
      return;
    }

    if (!deliveryData) {
      return;
    }

    setIsProcessing(true);

    try {
      const cartItemsWithPrices: CartItemWithPrice[] = validCartItems.map((item) => {
        const product = productsData[item.productId];
        if (!product) {
          return {
            productId: item.productId,
            quantity: item.quantity,
            price: 0,
          };
        }

        // Сначала применяем скидку на товар
        const priceWithDiscount = calculateFinalPrice(
          product.basePrice,
          product.discountPercent || 0
        );

        // Затем применяем скидку по карте лояльности, если есть
        const finalPrice = hasLoyaltyCard
          ? calculatePriceByCard(
              priceWithDiscount,
              CONFIG.CARD_DISCOUNT_PERCENT
            )
          : priceWithDiscount;

        return {
          productId: item.productId,
          quantity: item.quantity,
          price: finalPrice, // ← итоговая цена с учетом всех скидок
          basePrice: product.basePrice, // ← базовая цена
          discountPercent: product.discountPercent || 0, // ← скидка на товар
          hasLoyaltyDiscount: hasLoyaltyCard, // ← была ли применена скидка по карте
        };
      });

      // Создаем заказ с уже отфильтрованными товарами
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

      // Сохраняем номер заказа и показываем сообщение об успехе
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
    if (!isFormValid()) {
      return;
    }
    setIsOrdered(true);
    console.log("Оплата на сайте");
  };

  const handleNewOrder = () => {
    setIsOrdered(false);
    setOrderNumber(null);
    router.replace("/");
  };

  const baseStyles =
    "h-10 rounded w-full text-base items-center justify-center duration-300";
  const getButtonStyles = (isActive: boolean) => {
    if (isActive) {
      return `${baseStyles} bg-primary hover:shadow-button-default active:shadow-button-active text-white cursor-pointer`;
    } else {
      return `${baseStyles} bg-gray-300 text-gray-500 cursor-not-allowed`;
    }
  };

  return (
    <>
      <div className="flex flex-col gap-y-2.5 pb-6 border-b-2 border-[#f3f2f1]">
        <div className="flex flex-row justify-between">
          <p className="text-[#8f8f8f]">
            {validCartItems.length} {`товар${getFullEnding(validCartItems.length)}`}
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
              disabled={!isMinimumReached || validCartItems.length === 0}
              className={`p-4 rounded mx-auto w-full text-2xl ${
                isMinimumReached && validCartItems.length > 0
                  ? buttonStyles.active
                  : buttonStyles.inactive
              }`}
              onClick={onCheckout}
            >
              Оформить заказ
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              {!isOrdered ? (
                <>
                  <button
                    disabled={!canProceedWithPayment()}
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
                    disabled={!canProceedWithPayment()}
                    className={getButtonStyles(canProceedWithPayment())}
                    onClick={handleCashPayment}
                  >
                    {isProcessing ? "Оформление..." : "Оплатить при получении"}
                  </button>

                  {!deliveryData && (
                    <div className="text-sm text-yellow-600 text-center mt-2">
                      Заполните форму доставки
                    </div>
                  )}

                  {deliveryData && !deliveryData.isValid && (
                    <div className="text-sm text-red-500 text-center mt-2">
                      Заполните все обязательные поля доставки (город, улица,
                      дом, дата и время)
                    </div>
                  )}
                </>
              ) : (
                <OrderSuccessMessage
                  orderNumber={orderNumber}
                  onNewOrder={handleNewOrder}
                  baseStyles={baseStyles}
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