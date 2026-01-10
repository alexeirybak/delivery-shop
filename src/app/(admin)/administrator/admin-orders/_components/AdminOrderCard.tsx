import { useState, useEffect } from "react";
import { updateOrderStatus } from "@/app/(cart)/cart/utils/orderHelpers";
import { getMappedStatus } from "../utils/getMappedStatus";
import { getEnglishStatuses } from "../utils/getEnglishStatuses";
import StatusDropdown from "./StatusDropdown";
import UserAvatar from "./UserAvatar";
import IconVision from "@/components/svg/IconVision";
import Image from "next/image";
import { formatPhoneNumber } from "../utils/formatPhoneNumber";
import { useGetAdminOrdersQuery } from "@/store/redux/api/ordersApi";
import {
  useGetOrderMessagesQuery,
  useHasUnreadMessagesQuery,
} from "@/store/redux/api/chatApi";
import IconNotice from "@/components/svg/IconNotice";
import OrderChatModal from "./OrderChatModal";
import CalendarOrderModal from "./CalendarOrderModal";
import { buttonStyles } from "@/app/styles";
import OrderProductsLoader from "./OrderProductsLoader";
import OrderDetails from "./OrderDetails";
import { exportOrderToExcel } from "../utils/exportOrderToExcel";

interface AdminOrderCardProps {
  orderId: string;
}

const AdminOrderCard = ({ orderId }: AdminOrderCardProps) => {
  const { data } = useGetAdminOrdersQuery();

  const order = data?.orders?.find((o) => o._id === orderId);

  const [currentStatusLabel, setCurrentStatusLabel] = useState<string>(
    order ? getMappedStatus(order) : ""
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showFullOrder, setShowFullOrder] = useState(false);
  const [totalOrderWeight, setTotalOrderWeight] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const { data: messages = [] } = useGetOrderMessagesQuery(orderId);

  const { data: hasUnread = false } = useHasUnreadMessagesQuery(orderId, {
    pollingInterval: 2000,
  });

  const showCalendarIcon =
    order && (order.status === "confirmed" || order.status === "pending");

  useEffect(() => {
    if (order) {
      setCurrentStatusLabel(getMappedStatus(order));
    }
  }, [order]);

  const formattedPhone = order ? formatPhoneNumber(order.phone) : "";

  const handleStatusChange = async (newStatusLabel: string) => {
    if (!order) return;

    setIsUpdating(true);
    try {
      const { status: englishStatus, paymentStatus } = getEnglishStatuses(
        newStatusLabel,
        order
      );

      const updateData: { status: string; paymentStatus?: string } = {
        status: englishStatus,
      };

      if (paymentStatus !== undefined) {
        updateData.paymentStatus = paymentStatus;
      }

      await updateOrderStatus(order._id, updateData);
      setCurrentStatusLabel(newStatusLabel);
    } catch (error) {
      console.error("Ошибка при обновлении статуса:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleDetails = () => {
    if (!showOrderDetails) {
      setShowOrderDetails(true);
      setShowFullOrder(false);
    } else {
      setShowOrderDetails(false);
      setShowFullOrder(false);
    }
  };

  const handleToggleFullOrder = () => {
    if (showFullOrder) {
      setShowOrderDetails(false);
      setShowFullOrder(false);
    } else {
      setShowFullOrder(true);
    }
  };

  const handleOpenChat = () => {
    fetch(`/api/admin/chat/${orderId}/read`, {
      method: "POST",
    });
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
  };

  const handleOpenCalendar = () => {
    if (showCalendarIcon) {
      setShowCalendar(true);
    }
  };

  const handleCloseCalendar = () => {
    if (showCalendarIcon) {
      setShowCalendar(false);
    }
  };

  const handleTotalWeightCalculated = (weight: number) => {
    setTotalOrderWeight(weight);
  };

  const handleExportToExcel = async () => {
    if (!order || isExporting) return;

    setIsExporting(true);
    try {
      await exportOrderToExcel(order);
    } catch (error) {
      console.error("Ошибка при выгрузке в Excel:", error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!order) return null;

  return (
    <div className="flex flex-col">
      <div className="flex flex-1 flex-wrap justify-between items-start text-main-text gap-x-20">
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
          <div className="flex items-center gap-2">
            <Image
              alt="Телефон"
              src="/icons-orders/icon-phone.svg"
              width={24}
              height={24}
            />
            <span className="underline">{formattedPhone}</span>
          </div>

          <StatusDropdown
            currentStatusLabel={currentStatusLabel}
            isUpdating={isUpdating}
            onStatusChange={handleStatusChange}
          />
          {!showOrderDetails && (
            <button
              className="bg-[#f3f2f1] hover:shadow-button-secondary w-50 h-10 px-2 flex justify-center items-center gap-2 rounded duration-300 cursor-pointer"
              onClick={handleToggleDetails}
            >
              <IconVision showPassword={!showOrderDetails} />
              Просмотреть
            </button>
          )}

          {showOrderDetails && (
            <button
              className={`${buttonStyles.active} hover:shadow-button-secondary w-50 h-10 px-2 flex justify-center items-center gap-2 rounded duration-300 cursor-pointer`}
              onClick={handleExportToExcel}
            >
              <Image
                src="/icons-orders/icon-upload.svg"
                alt="Excel"
                width={24}
                height={24}
              />
              Выгрузить в Excel
            </button>
          )}

          {showCalendarIcon ? (
            <div>
              <button
                className="relative bg-[#f3f2f1] hover:shadow-button-secondary w-10 h-10 px-2 flex justify-center items-center gap-2 rounded duration-300 cursor-pointer"
                onClick={handleOpenCalendar}
              >
                <Image
                  src="/icons-auth/icon-date.svg"
                  alt="Календарь"
                  width={24}
                  height={24}
                />
              </button>
              <CalendarOrderModal
                orderId={orderId}
                isOpen={showCalendar}
                onClose={handleCloseCalendar}
              />
            </div>
          ) : (
            <button
              className="relative bg-[#f3f2f1] hover:shadow-button-secondary w-10 h-10 px-2 flex justify-center items-center gap-2 rounded duration-300 cursor-pointer"
              onClick={handleOpenChat}
            >
              {messages.length === 0 ? (
                <Image
                  src="/icons-orders/icon-message-empty.svg"
                  alt="Чат пустой"
                  width={24}
                  height={24}
                />
              ) : (
                <Image
                  src="/icons-orders/icon-message.svg"
                  alt="Чат"
                  width={24}
                  height={24}
                />
              )}
              {hasUnread && <IconNotice />}
            </button>
          )}
        </div>
      </div>
      {/* Товары показываем когда showOrderDetails = true */}
      {showOrderDetails && (
        <>
          <OrderProductsLoader
            orderItems={order.items}
            onTotalWeightCalculated={handleTotalWeightCalculated}
            applyIndexStyles={!showFullOrder}
            showFullOrder={showFullOrder}
          />

          {/* Полные детали заказа показываем когда showFullOrder = true */}
          {showFullOrder && (
            <OrderDetails order={order} totalWeight={totalOrderWeight} />
          )}
        </>
      )}

      {/* Нижняя кнопка Показать заказ/Скрыть */}
      {showOrderDetails && !showFullOrder && (
        <div className="flex justify-center mt-10">
          <button
            className="bg-[#f3f2f1] hover:shadow-button-secondary text-main-text w-60 h-10 px-2 flex justify-center items-center gap-2 rounded duration-300 cursor-pointer"
            onClick={handleToggleFullOrder}
          >
            <IconVision showPassword={true} />
            Показать заказ
          </button>
        </div>
      )}
      {showFullOrder && (
        <div className="flex justify-center mt-10">
          <button
            className="bg-[#f3f2f1] hover:shadow-button-secondary text-main-text w-60 h-10 px-2 flex justify-center items-center gap-2 rounded duration-300 cursor-pointer"
            onClick={handleToggleFullOrder}
          >
            <IconVision showPassword={false} />
            Скрыть
          </button>
        </div>
      )}
      <OrderChatModal
        orderId={orderId}
        isOpen={showChat}
        onClose={handleCloseChat}
      />
    </div>
  );
};

export default AdminOrderCard;
