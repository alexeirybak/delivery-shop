import { CreditCard } from "lucide-react";
import { getFullEnding } from "../../../../../utils/getWordEnding";
import { useCartStore } from "@/store/cartStore";
import { CONFIG } from "../../../../../config/config";
import { useRouter } from "next/navigation";

const OrderSuccessMessage = ({
  orderNumber,
}: {
  orderNumber: string | null;
}) => {
  const { pricing, useBonuses } = useCartStore();
  const { totalBonuses, maxBonusUse, totalPrice } = pricing;
  const { resetAfterOrder } = useCartStore();
  const router = useRouter();

  const handleToOrder = () => {
    resetAfterOrder();
    router.push("/user-orders");
  };

  const usedBonuses = Math.min(
    maxBonusUse,
    Math.floor((totalPrice * CONFIG.MAX_BONUSES_PERCENT) / 100)
  );

  return (
    <div className="text-center p-4 bg-[#e5ffde] text-[#008c49] rounded border border-primary">
      <div className="font-bold text-lg mb-2">Заказ оформлен успешно!</div>
      <div className="mb-3">
        Номер вашего заказа: <strong>{orderNumber}</strong>
      </div>
      <div className="text-sm mb-3">
        Вы можете оплатить заказ при получении курьеру наличными или картой. С
        Вами свяжутся для подтверждения времени доставки.
      </div>
      {useBonuses && (
        <div className="text-sm mb-3 text-primary flex items-center justify-center gap-2">
          <CreditCard size={16} className="flex-shrink-0" />
          {usedBonuses} бонус
          {getFullEnding(usedBonuses)} будет списано после подтверждения оплаты
        </div>
      )}
      <div className="text-sm mb-3 text-primary flex items-center justify-center gap-2">
        <CreditCard size={16} className="flex-shrink-0" />
        После доставки вам будет начислено {totalBonuses} бонус
        {getFullEnding(totalBonuses)}
      </div>
      <button
        onClick={handleToOrder}
        className="ml-4 bg-[#008c48] text-white px-4 py-2 rounded hover:bg-[#006c38] duration-300 font-medium cursor-pointer"
      >
        Перейти на страницу заказов
      </button>
    </div>
  );
};

export default OrderSuccessMessage;
