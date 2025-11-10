import Image from "next/image";
import { formatPrice } from "../../../../../utils/formatPrice";
import { formatOrderDate } from "./utils/formatOrderDate";
import { getStatusColor } from "./utils/getStatusColor";
import { getStatusText } from "./utils/getStatusText";

const OrderHeader = ({
  order,
  showDeliveryButton,
  onOrderClick,
  onDeliveryClick,
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
            onClick={onOrderClick}
            className="w-50 h-10 rounded duration-300 bg-[#ff6633] text-white hover:shadow-button-default cursor-pointer"
          >
            Заказать
          </button>
        ) : (
          <button
            onClick={onDeliveryClick}
            className="bg-primary text-white flex justify-between items-center border-none rounded cursor-pointer duration-300 hover:shadow-button-default w-50 h-10 p-2"
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
