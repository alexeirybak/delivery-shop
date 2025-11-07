import { Order } from "@/types/order";
import { formatOrderDate } from "./utils/formatOrderDate";
import Image from "next/image";
import { getStatusColor } from "./utils/getStatusColor";
import { getStatusText } from "./utils/getStatusText";
import { formatPrice } from "../../../../../utils/formatPrice";

interface OrderHeaderProps {
  order: Order;
  showDeliveryButton: boolean;
  onOrderClick: () => void;
  onDeliveryClick: () => void;
  disabled?: boolean;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({
  order,
  showDeliveryButton,
  onOrderClick,
  onDeliveryClick,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-10.5 gap-6">
      <div className="flex flex-row text-sm lg:text-2xl gap-6 items-center">
        <p className="font-bold">{formatOrderDate(order.deliveryDate)}</p>
        <p className="font-bold">{order.deliveryTimeSlot}</p>
        <span
          className={`px-2 py-1 rounded text-base shrink-0 ${getStatusColor(order.status)}`}
        >
          {getStatusText(order.status)}
        </span>
      </div>
      <div className="flex flex-row gap-6 items-center">
        <p className="text-sm lg:text-2xl">
          {formatPrice(order.totalAmount)} ₽
        </p>

        {!showDeliveryButton ? (
          <button
            className={`
              w-50 h-10 rounded duration-300
              ${
                disabled
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                  : "bg-primary text-white hover:shadow-button-default cursor-pointer"
              }
            `}
            onClick={onOrderClick}
            disabled={disabled}
          >
            {disabled ? "Недоступно" : "Заказать"}
          </button>
        ) : (
          <button
            className="bg-primary text-white flex justify-between items-center border-none rounded cursor-pointer duration-300 hover:shadow-button-default w-50 h-10 p-2"
            onClick={onDeliveryClick}
          >
            <Image
              src="/icons-auth/icon-date.svg"
              alt="Календарь"
              width={24}
              height={24}
            />
            <p className="flex-1">Когда доставить</p>
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderHeader;
