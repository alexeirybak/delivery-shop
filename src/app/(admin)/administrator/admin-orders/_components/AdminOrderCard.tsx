import Image from "next/image";
import { Order } from "@/types/order";
import UserAvatar from "./UserAvatar";
import { formatPhoneNumber } from "../utils/formatPhoneNumber";
import IconVision from "@/components/svg/IconVision";
import StatusDropdown from "./StatusDropdown";
import { useState } from "react";
import { getMappedStatus } from "../utils/getMappedStatus";
import { updateOrderStatus } from "@/app/(cart)/cart/utils/orderHelpers";
import { getEnglishStatuses } from "../utils/getEnglishStatuses";

interface AdminOrderCardProps {
  order: Order;
  onStatusUpdate?: (orderId: string, newStatus: string) => void;
}

const AdminOrderCard = ({ order, onStatusUpdate }: AdminOrderCardProps) => {
  const [currentStatusLabel, setCurrentStatusLabel] = useState<string>(
    getMappedStatus(order)
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const handleStatusChange = async (newStatusLabel: string) => {
    setIsUpdating(true);
    try {
      // Получаем английские статусы для заказа и платежа
      const { status: englishStatus, paymentStatus } = getEnglishStatuses(
        newStatusLabel,
        order
      );

      // Формируем объект для обновления
      const updateData: { status: string; paymentStatus?: string } = {
        status: englishStatus,
      };

      // Добавляем paymentStatus только если он определен
      if (paymentStatus !== undefined) {
        updateData.paymentStatus = paymentStatus;
      }

      // Вызываем API функцию с правильными параметрами
      await updateOrderStatus(order._id, updateData);

      setCurrentStatusLabel(newStatusLabel);

      if (onStatusUpdate) {
        onStatusUpdate(order._id, englishStatus);
      }
    } catch (error) {
      console.error("Ошибка при обновлении статуса:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleDetails = () => {
    setShowOrderDetails(!showOrderDetails);
  };

  return (
    <>
      <div className="flex flex-1 flex-wrap justify-between items-start text-main-text gap-20">
        <div className="flex gap-x-4 items-center">
          <h2 className="text-base md:text-lg xl:text-2xl font-bold">
            {order.orderNumber.slice(-3)}
          </h2>
          <div className="flex items-center gap-x-2">
            <UserAvatar
              userId={order.userId}
              gender={order.gender}
              name={order.name}
            />
            <span className="text-base md:text-lg">{order.name}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-5 items-center">
          {/* Телефон */}
          <div className="flex items-center gap-2">
            <Image
              alt="Телефон"
              src="/icons-orders/icon-phone.svg"
              width={24}
              height={24}
            />
            <span className="underline">{formatPhoneNumber(order.phone)}</span>
          </div>
          <StatusDropdown
            currentStatusLabel={currentStatusLabel}
            isUpdating={isUpdating}
            onStatusChange={handleStatusChange}
          />

          {/* Кнопка просмотра/скрытия */}
          <button
            className="bg-[#f3f2f1] hover:shadow-button-secondary w-50 h-10 px-2 flex justify-center items-center gap-2 rounded duration-300 cursor-pointer"
            onClick={handleToggleDetails}
          >
            <IconVision showPassword={!showOrderDetails} />
            {showOrderDetails ? "Скрыть заказ" : "Просмотреть заказ"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminOrderCard;
