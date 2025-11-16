import { CheckCircle } from "lucide-react";
import { formatPrice } from "../../../../../utils/formatPrice";

interface PricePreservedAlertProps {
  orderTotal: number;
}

export const PricePreservedAlert: React.FC<PricePreservedAlertProps> = ({
  orderTotal,
}) => {
  return (
    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-green-800 font-semibold mb-2 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Цены сохранены
          </h3>
          <p className="text-green-700 text-sm">
            Цены и скидки на товары не изменились. Повторный заказ будет создан с теми же ценами, что и в предыдущем заказе.
          </p>
          <div className="mt-2 p-2 bg-green-100 rounded">
            <p className="text-green-800 font-medium text-sm">
              Сумма заказа: {formatPrice(orderTotal)} ₽
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};