import { CartSummaryProps } from "../../../../types/cart";
import { useCartStore } from "@/store/cartStore";
import { CONFIG } from "../../../../../config/config";
import { useState } from "react";
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

const CartSummary = ({ deliveryData, productsData = {} }: CartSummaryProps) => {
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

    try {
      if (paymentMethod === "online") {
        if (paymentData?.status === "succeeded") {
          await confirmOrderPayment(currentOrderId!);
          await updateUserAfterPayment({
            usedBonuses: actualUsedBonuses,
            earnedBonuses: totalBonuses,
            purchasedProductIds: visibleCartItems.map((item) => item.productId),
          });
        }

        const successModalData: PaymentSuccessData = {
          orderNumber: orderNumber!,
          paymentId: paymentData!.id,
          amount: finalPrice,
          cardLast4: paymentData!.cardLast4,
        };

        setSuccessData(successModalData);
        setShowSuccessModal(true);
      } else {
        const result = await createOrder(paymentMethod, paymentData?.id);
        setOrderNumber(result.orderNumber);
      }

      setIsOrdered(true);
    } catch (error) {
      console.error(`Ошибка:`, error);
      alert(`Ошибка при обработке заказаы`);
    } finally {
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
      if (currentOrderId && orderNumber) {
        setShowPaymentModal(true);
      } else {
        const result = await createOrder("online");
        setOrderNumber(result.orderNumber);
        setCurrentOrderId(result.order._id);
        setShowPaymentModal(true);
      }
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
    try {
      await handlePaymentResult("online", paymentData);
    } catch (error) {
      console.error("Ошибка обработки заказа:", error);
    }
  };

  const handlePaymentError = (error: string) => {
    setShowPaymentModal(false);
    alert(`Ошибка оплаты: ${error}`);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
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
        {!isCheckout ? (
          <CheckoutButton
            isCheckout={isCheckout}
            isMinimumReached={isMinimumReached}
            visibleCartItemsCount={visibleCartItems.length}
            onCheckout={() => setIsCheckout(true)}
          />
        ) : (
          <PaymentButtons
            isOrdered={isOrdered}
            paymentType={paymentType}
            orderNumber={orderNumber}
            isProcessing={isProcessing}
            canProceedWithPayment={canProceedWithPayment()}
            onOnlinePayment={handleOnlinePayment}
            onCashPayment={handleCashPayment}
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
