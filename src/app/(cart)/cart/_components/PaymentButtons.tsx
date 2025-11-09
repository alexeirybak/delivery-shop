import { buttonStyles } from "@/app/styles";
import OrderSuccessMessage from "./OrderSuccessMessage";

interface PaymentButtonsProps {
  isOrdered: boolean;
  paymentType: "cash_on_delivery" | "online" | null;
  orderNumber: string | null;
  isProcessing: boolean;
  canProceedWithPayment: boolean;
  onOnlinePayment: () => void;
  onCashPayment: () => void;
}

export const PaymentButtons = ({
  isOrdered,
  paymentType,
  orderNumber,
  isProcessing,
  canProceedWithPayment,
  onOnlinePayment,
  onCashPayment,
}: PaymentButtonsProps) => {
  if (isOrdered && paymentType === "cash_on_delivery") {
    return <OrderSuccessMessage orderNumber={orderNumber} />;
  }

  if (isOrdered) return null;
  
  return (
    <div className="flex flex-col gap-3">
      <button
        disabled={!canProceedWithPayment}
        onClick={onOnlinePayment}
        className={`rounded w-full text-xl h-15 items-center justify-center ${
          canProceedWithPayment ? buttonStyles.active : buttonStyles.inactive
        }`}
      >
        {isProcessing ? "Обработка..." : "Оплатить на сайте"}
      </button>

      <button
        disabled={!canProceedWithPayment}
        onClick={onCashPayment}
        className={`h-10 rounded w-full text-base items-center justify-center duration-300 ${
          canProceedWithPayment
            ? "bg-primary hover:shadow-button-default active:shadow-button-active text-white cursor-pointer"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {isProcessing ? "Оформление..." : "Оплатить при получении"}
      </button>
    </div>
  );
};

export default PaymentButtons;
