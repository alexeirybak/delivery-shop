import { CreditCard } from "lucide-react";
import { getFullEnding } from "../../../../../utils/getWordEnding";
import { useCartStore } from "@/store/cartStore";
import { CONFIG } from "../../../../../config/config";

interface OrderSuccessMessageProps {
  orderNumber: string | null;
  onNewOrder: () => void;
  baseStyles: string;
}

const OrderSuccessMessage = ({
  orderNumber,
  onNewOrder,
  baseStyles,
}: OrderSuccessMessageProps) => {
  const { pricing, useBonuses } = useCartStore();
  const { totalBonuses, maxBonusUse, totalPrice } = pricing;

  const usedBonuses = Math.min(
    maxBonusUse,
    Math.floor((totalPrice * CONFIG.MAX_BONUSES_PERCENT) / 100)
  );

  return (
    <div className="text-center p-4 bg-[#e5ffde] text-[#008c49] rounded border border-primary">
      <div className="font-bold text-lg mb-2">
        Заказ оформлен успешно!
      </div>
      <div className="mb-3">
        Номер вашего заказа: <strong>{orderNumber}</strong>
      </div>
      <div className="text-sm mb-3">
        Вы можете оплатить заказ при получении курьеру наличными или
        картой. С Вами свяжутся для подтверждения времени доставки.
      </div>
      {useBonuses && (
        <div className="text-sm mb-3 text-primary flex items-center justify-center gap-2">
          <CreditCard size={16} className="flex-shrink-0" />
          {usedBonuses} бонус
          {getFullEnding(usedBonuses)} будет списано после
          подтверждения оплаты
        </div>
      )}
      <div className="text-sm mb-3 text-primary flex items-center justify-center gap-2">
        <CreditCard size={16} className="flex-shrink-0" />
        После доставки вам будет начислено {totalBonuses} бонус
        {getFullEnding(totalBonuses)}
      </div>
      <button
        onClick={onNewOrder}
        className={`${baseStyles} bg-primary hover:shadow-button-default active:shadow-button-active text-white cursor-pointer duration-300`}
      >
        Вернуться на главную
      </button>
    </div>
  );
};

export default OrderSuccessMessage;