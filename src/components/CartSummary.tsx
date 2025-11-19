import { ExtendedCartSummaryProps } from "../types/cart";
import { useCartStore } from "@/store/cartStore";
import { CONFIG } from "../../config/config";
import { useState } from "react";
import PriceSummary from "../app/(cart)/cart/_components/PriceSummary";
import MinimumOrderWarning from "../app/(cart)/cart/_components/MinimumOrderWarning";
import CheckoutButton from "../app/(cart)/cart/_components/CheckoutButton";
import PaymentButtons from "../app/(cart)/cart/_components/PaymentButtons";
import { FakePaymentData, PaymentSuccessData } from "@/types/payment";
import {
  clearUserCart,
  confirmOrderPayment,
  createOrderRequest,
  prepareCartItemsWithPrices,
  updateOrderStatus,
  updateUserAfterPayment,
} from "../app/(cart)/cart/utils/orderHelpers";
import FakePaymentModal from "@/app/(payment)/FakePaymentModal";
import PaymentSuccessModal from "@/app/(payment)/PaymentSuccessModal";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { ProductCardProps } from "@/types/product";

const CartSummary = ({
  deliveryData,
  productsData = {},
  isRepeatOrder = false,
  customPricing,
  customCartItems,
  onOrderSuccess,
}: ExtendedCartSummaryProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<
    "cash_on_delivery" | "online" | null
  >(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<PaymentSuccessData | null>(
    null
  );
  const router = useRouter();

  const { user } = useAuthStore();
  const actualHasLoyaltyCard = !!user?.card;

  const {
    pricing,
    cartItems,
    hasLoyaltyCard,
    isCheckout,
    setIsCheckout,
    isOrdered,
    setIsOrdered,
    useBonuses,
    resetAfterOrder,
    updatePricing,
  } = useCartStore();

  const visibleCartItems =
    isRepeatOrder && customCartItems
      ? customCartItems
      : cartItems.filter((item) => item.quantity > 0);

  const currentPricing =
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

    if (isRepeatOrder) {
      updatePricing({
        ...currentPricing,
        totalBonuses,
      });
    }

    const effectiveHasLoyaltyCard = isRepeatOrder
      ? actualHasLoyaltyCard
      : hasLoyaltyCard;

    const cartItemsWithPrices = prepareCartItemsWithPrices(
      visibleCartItems,
      productsData as { [key: string]: ProductCardProps },
      effectiveHasLoyaltyCard
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

  const handlePaymentResult = async (
    paymentMethod: "cash_on_delivery" | "online",
    paymentData?: FakePaymentData
  ) => {
    if (!deliveryData) {
      console.error("Данные доставки не заполнены");
      return;
    }

    setIsProcessing(true);
    setPaymentType(paymentMethod === "online" ? "online" : "cash_on_delivery");

    let orderCreated = false;

    try {
      if (paymentMethod === "online") {
        if (paymentData?.status === "succeeded") {
          // УСПЕШНАЯ ОПЛАТА - заказ уже создан в handleOnlinePayment
          await confirmOrderPayment(currentOrderId!);
          await updateUserAfterPayment({
            usedBonuses: actualUsedBonuses,
            earnedBonuses: totalBonuses,
            purchasedProductIds: visibleCartItems.map((item) => item.productId),
          });

          orderCreated = true; // Заказ был создан ранее

          const successModalData: PaymentSuccessData = {
            orderNumber: orderNumber!,
            paymentId: paymentData!.id,
            amount: finalPrice,
            cardLast4: paymentData!.cardLast4,
          };

          setSuccessData(successModalData);
          setShowSuccessModal(true);
        } else {
          // НЕУСПЕШНАЯ ОПЛАТА - заказ создан, но оплата failed
          orderCreated = true; // Заказ был создан ранее
          router.push("/user-orders");
        }
      } else {
        // НАЛИЧНЫЕ ПРИ ПОЛУЧЕНИИ - создаем заказ здесь
        const result = await createOrder(paymentMethod, paymentData?.id);
        setOrderNumber(result.orderNumber);
        orderCreated = true; // Заказ успешно создан
      }

      setIsOrdered(true);
    } catch (error) {
      console.error(`Ошибка:`, error);
      alert(`Ошибка при обработке заказа`);
    } finally {
      // ОЧИСТКА ТОЛЬКО ЕСЛИ ЗАКАЗ ГАРАНТИРОВАННО СОЗДАН В БД
      if (orderCreated) {
        await clearUserCart();
        resetAfterOrder();
      }
      setIsProcessing(false);
    }
  };

  const handleCashPayment = async () => {
    await handlePaymentResult("cash_on_delivery");
  };

  const handleOnlinePayment = async () => {
    if (!deliveryData) {
      console.error("Данные доставки не заполнены");
      return;
    }

    setIsProcessing(true);

    try {
      const result = await createOrder("online");
      setOrderNumber(result.orderNumber);
      setCurrentOrderId(result.order._id);

      // ЗАКАЗ УЖЕ СОЗДАН В БД - можно показывать модалку оплаты
      setShowPaymentModal(true);
    } catch (error) {
      console.error("Ошибка при создании заказа:", error);
      alert("Ошибка при создании заказа");
      // НЕ очищаем корзину - заказ не создан
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
      await handlePaymentResult("online", paymentData);
    } catch (error) {
      console.error("Ошибка обработки заказа:", error);
    }
  };

  const handlePaymentError = async (error: string) => {
    setShowPaymentModal(false);

    if (currentOrderId) {
      try {
        // Используем универсальную функцию
        await updateOrderStatus(currentOrderId, { paymentStatus: "failed" });
        alert(error);
      } catch (updateError) {
        console.error("Ошибка при обновлении статуса платежа:", updateError);
        alert(`Ошибка оплаты: ${error}`);
      }
    } else {
      alert(`Ошибка оплаты: ${error}`);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    if (isRepeatOrder && onOrderSuccess) {
      onOrderSuccess();
    }
    setIsOrdered(false); // Сбрасываем флаг заказа
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
