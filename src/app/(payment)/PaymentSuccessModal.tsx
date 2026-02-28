import { PaymentSuccessData } from "@/types/payment";
import { formatPrice } from "../../../utils/formatPrice";
import { IconSuccessPayment } from "@/components/svg/IconSuccessPayment";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  successData: PaymentSuccessData | null;
}

const PaymentSuccessModal = ({
  isOpen,
  onClose,
  successData,
}: PaymentSuccessModalProps) => {
  if (!isOpen || !successData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 text-center bg-white rounded-lg">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
          <IconSuccessPayment />
        </div>

        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Оплата прошла успешно!
        </h2>

        <div className="p-4 mb-6 space-y-3 text-left rounded-lg bg-gray-50">
          <div className="flex justify-between">
            <span className="text-gray-600">Номер заказа:</span>
            <span className="font-semibold">{successData.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">ID платежа:</span>
            <span className="font-mono text-sm">{successData.paymentId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Сумма:</span>
            <span className="font-semibold">
              {formatPrice(successData.amount)} ₽
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Карта:</span>
            <span className="font-mono">**** {successData.cardLast4}</span>
          </div>
        </div>

        <p className="mb-6 text-gray-600">
          Ваш заказ успешно оплачен и передан в обработку. В ближайшее время с
          Вами свяжется наш менеджер для подтверждения доставки.
        </p>

        <button
          onClick={onClose}
          className="w-full px-4 py-3 font-medium text-white  bg-green-600 rounded-lg cursor-pointer hover:bg-green-700"
        >
          Понятно
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;
