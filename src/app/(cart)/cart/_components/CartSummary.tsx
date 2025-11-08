import {
  ExtendedCartSummaryProps,
  CustomCartItem,
  CustomPricing,
} from "@/types/cart";
import { useCartStore } from "@/store/cartStore";
import { CONFIG } from "../../../../../config/config";
import { useState, useEffect } from "react";
import PriceSummary from "./PriceSummary";
import MinimumOrderWarning from "./MinimumOrderWarning";
import CheckoutButton from "./CheckoutButton";
import PaymentButtons from "./PaymentButtons";
import { FakePaymentData, PaymentSuccessData } from "@/types/payment";
import {
  confirmOrderPayment,
  createOrderRequest,
  prepareCartItemsWithPrices,
  updateUserAfterPayment,
} from "../utils/orderHelpers";
import FakePaymentModal from "@/app/(payment)/FakePaymentModal";
import PaymentSuccessModal from "@/app/(payment)/PaymentSuccessModal";
import { useRouter } from "next/navigation";

const CartSummary = ({
  deliveryData,
  productsData = {},
  customCartItems,
  customPricing,
  hasLoyaltyCard = false,
  isRepeatOrder = false,
  onOrderSuccess,
}: ExtendedCartSummaryProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<
    "cash_on_delivery" | "online" | null
  >(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<PaymentSuccessData | null>(
    null
  );
  // Добавьте state для хранения ID заказа
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const router = useRouter();

  const {
    pricing,
    cartItems,
    isCheckout,
    setIsCheckout,
    isOrdered,
    setIsOrdered,
    useBonuses,
    resetAfterOrder,
  } = useCartStore();

  // Для повторного заказа автоматически показываем checkout
  useEffect(() => {
    if (isRepeatOrder) {
      setIsCheckout(true);
    }
  }, [isRepeatOrder, setIsCheckout]);

  // Используем кастомные данные или преобразуем данные из store
  const visibleCartItems: CustomCartItem[] =
    isRepeatOrder && customCartItems
      ? customCartItems
      : cartItems
          .filter((item) => item.quantity > 0)
          .map(
            (item): CustomCartItem => ({
              productId: item.productId,
              quantity: item.quantity,
              price: 0, // Значение по умолчанию, будет переопределено в prepareCartItemsWithPrices
              discountPercent: 0,
              hasLoyaltyDiscount: false,
              addedAt: item.addedAt || new Date(), // Используем existing addedAt или текущую дату
            })
          );

  const currentPricing: CustomPricing =
    isRepeatOrder && customPricing ? customPricing : pricing;

  const {
    totalPrice,
    totalMaxPrice,
    totalDiscount,
    finalPrice,
    totalBonuses,
    maxBonusUse,
    isMinimumReached,
  } = currentPricing;

  const usedBonuses = Math.min(
    maxBonusUse,
    Math.floor((totalPrice * CONFIG.MAX_BONUSES_PERCENT) / 100)
  );

  const actualUsedBonuses = useBonuses ? usedBonuses : 0;

  const createOrder = async (
    paymentMethod: "cash_on_delivery" | "online",
    paymentId?: string
  ) => {
    if (!deliveryData) {
      throw new Error("Данные доставки не заполнены");
    }

    const cartItemsWithPrices = prepareCartItemsWithPrices(
      visibleCartItems,
      productsData,
      hasLoyaltyCard
    );

    const orderData = {
      finalPrice,
      totalBonuses,
      usedBonuses: actualUsedBonuses,
      totalDiscount,
      deliveryAddress: deliveryData.address,
      deliveryTime: deliveryData.time,
      cartItems: cartItemsWithPrices,
      totalPrice: totalMaxPrice,
      paymentMethod,
      paymentId,
    };

    return await createOrderRequest(orderData);
  };

  const handleOrderCreation = async (
    paymentMethod: "cash_on_delivery" | "online",
    paymentData?: FakePaymentData
  ) => {
    if (!deliveryData) return;

    setIsProcessing(true);
    setPaymentType(paymentMethod === "online" ? "online" : "cash_on_delivery");

    try {
      // Заказ уже создан, просто обрабатываем результат оплаты
      if (paymentMethod === "online" && paymentData?.status === "succeeded") {
        // УСПЕШНАЯ ОПЛАТА - списываем товары
        await confirmOrderPayment(currentOrderId!);
        await updateUserAfterPayment({
          usedBonuses: actualUsedBonuses,
          earnedBonuses: totalBonuses,
          purchasedProductIds: visibleCartItems.map((item) => item.productId),
        });

        const successModalData: PaymentSuccessData = {
          orderNumber: orderNumber!,
          paymentId: paymentData.id,
          amount: finalPrice,
          cardLast4: paymentData.cardLast4,
        };

        setSuccessData(successModalData);
        setShowSuccessModal(true);
      }
      // При ошибке оплаты ничего не делаем - заказ уже создан

      setIsOrdered(true);
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Ошибка при обработке заказа");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCashPayment = async () => {
    await handleOrderCreation("cash_on_delivery");
  };

  const handleOnlinePayment = async () => {
    if (!deliveryData) {
      console.error("Данные доставки не заполнены");
      return;
    }

    setIsProcessing(true);

    try {
      // 🔥 СОЗДАЕМ ЗАКАЗ ПЕРЕД ОТКРЫТИЕМ МОДАЛКИ
      const result = await createOrder("online");
      setOrderNumber(result.orderNumber);

      // Сохраняем ID заказа для использования в модалке
      setCurrentOrderId(result.order._id);

      // Теперь открываем модалку оплаты
      setShowPaymentModal(true);
    } catch (error) {
      console.error("Ошибка при создании заказа:", error);
      alert("Ошибка при создании заказа");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
  };

  const handlePaymentSuccess = async (paymentData: FakePaymentData) => {
    setShowPaymentModal(false);
    try {
      await handleOrderCreation("online", paymentData);
    } catch (error) {
      console.error("Ошибка создания заказа:", error);
    }
  };

  const handlePaymentError = (error: string) => {
    setShowPaymentModal(false);
    alert(`Ошибка оплаты: ${error}`);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    if (isRepeatOrder && onOrderSuccess) {
      onOrderSuccess();
    }
    setIsOrdered(true);
    resetAfterOrder();
    router.push("/user-orders");
  };

  const isFormValid = (): boolean => {
    if (!deliveryData) {
      return false;
    }

    const { address, time } = deliveryData;

    const isAddressValid = Boolean(
      address.city?.trim() && address.street?.trim() && address.house?.trim()
    );

    const isTimeValid = Boolean(time.date?.trim() && time.timeSlot?.trim());

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
      <PriceSummary
        visibleCartItems={visibleCartItems}
        totalMaxPrice={totalMaxPrice}
        totalDiscount={totalDiscount}
        finalPrice={finalPrice}
        totalBonuses={totalBonuses}
      />

      <div className="w-full">
        <MinimumOrderWarning isMinimumReached={isMinimumReached} />

        {/* Всегда показываем кнопки оплаты для повторного заказа */}
        {isRepeatOrder || isCheckout ? (
          <PaymentButtons
            isOrdered={isOrdered}
            paymentType={paymentType}
            orderNumber={orderNumber}
            isProcessing={isProcessing}
            canProceedWithPayment={canProceedWithPayment()}
            onOnlinePayment={handleOnlinePayment}
            onCashPayment={handleCashPayment}
          />
        ) : (
          <CheckoutButton
            isCheckout={isCheckout}
            isMinimumReached={isMinimumReached}
            visibleCartItemsCount={visibleCartItems.length}
            onCheckout={() => setIsCheckout(true)}
          />
        )}
      </div>

      <FakePaymentModal
        amount={finalPrice}
        isOpen={showPaymentModal}
        onClose={handleClosePaymentModal}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />

      <PaymentSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        successData={successData}
      />
    </>
  );
};

export default CartSummary;
