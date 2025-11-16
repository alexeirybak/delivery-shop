import { AlertTriangle } from "lucide-react";
import { formatPrice } from "../../../../../utils/formatPrice";
import { PriceComparison } from "@/types/userOrder";

interface PriceComparisonAlertProps {
  priceComparison: PriceComparison;
  onClose: () => void;
}

export const PriceComparisonAlert: React.FC<PriceComparisonAlertProps> = ({
  priceComparison,
  onClose,
}) => {
  console.log(priceComparison);
  return (
    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-yellow-800 font-semibold mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Внимание: цены или скидки изменились
          </h3>
          <p className="text-yellow-700 text-sm mb-2">
            С момента предыдущего заказа произошли изменения. Заказ будет создан
            по актуальным ценам и скидкам, а также с учетом статуса карты
            лояльности и скидок по ней.
          </p>

          {priceComparison.changedItems.length > 0 && (
            <div className="mt-2">
              <p className="text-yellow-800 font-medium text-sm">Изменения:</p>
              <ul className="text-yellow-700 text-sm mt-1 space-y-2">
                {priceComparison.changedItems.map((item, index) => (
                  <li key={index} className="flex flex-col">
                    <span className="font-medium">{item.productName}</span>
                    <div className="flex flex-wrap gap-4 mt-1">
                      {item.priceChanged && (
                        <span>
                          Цена: {formatPrice(item.originalPrice)} ₽ →{" "}
                          {formatPrice(item.currentPrice)} ₽
                        </span>
                      )}
                      {item.quantity > 1 && (
                        <span>Количество: ×{item.quantity}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-3 p-2 bg-yellow-100 rounded">
            <p className="text-yellow-800 font-medium text-sm">
              <span className="block">
                Сумма в предыдущем заказе:{" "}
                {formatPrice(priceComparison.originalTotal)} ₽
              </span>
              <span className="block">
                Сумма по актуальным ценам:{" "}
                {formatPrice(priceComparison.currentTotal)} ₽
              </span>
              {priceComparison.difference !== 0 && (
                <span
                  className={`block ${
                    priceComparison.difference > 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  Изменение: {priceComparison.difference > 0 ? "+" : ""}
                  {formatPrice(priceComparison.difference)} ₽
                </span>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-yellow-600 hover:text-yellow-800 text-lg font-bold ml-4 flex-shrink-0"
        >
          ×
        </button>
      </div>
    </div>
  );
};
