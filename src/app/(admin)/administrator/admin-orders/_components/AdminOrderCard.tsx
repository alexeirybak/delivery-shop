import { Order } from "@/types/order";
import OrderProductsLoader from "./OrderProductsLoader";
import { useState } from "react";
import { updateOrderStatus } from "@/app/(cart)/cart/utils/orderHelpers";
import { getMappedStatus } from "../utils/getMappedStatus";
import { getEnglishStatuses } from "../utils/getEnglishStatuses";
import StatusDropdown from "./StatusDropdown";
import UserAvatar from "./UserAvatar";
import IconVision from "@/components/svg/IconVision";
import Image from "next/image";
import { formatPhoneNumber } from "../utils/formatPhoneNumber";
import {
  generateOrderExcel,
  downloadExcel,
} from "../../../../../../utils/excelGenerator";
import {
  ExcelExportData,
  OrderData,
  OrderItemWithDetails,
} from "@/types/excel";

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
      console.log("New status label:", newStatusLabel);

      // Получаем английские статусы для заказа и платежа
      const { status: englishStatus, paymentStatus } = getEnglishStatuses(
        newStatusLabel,
        order
      );

      console.log("Updating with:", {
        status: englishStatus,
        paymentStatus: paymentStatus,
      });

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

  const handleHideOrder = () => {
    setShowOrderDetails(false);
  };

  const loadFullOrderData = async (): Promise<ExcelExportData> => {
    try {
      const response = await fetch(`/api/orders/${order._id}/full-data`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Ошибка загрузки данных");
      }

      return result.data as ExcelExportData;
    } catch (error) {
      console.error("Ошибка загрузки данных заказа:", error);

      const baseProductsDetails: OrderItemWithDetails[] = order.items.map(
        (item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          discountPercent: item.discountPercent,
          hasLoyaltyDiscount: item.hasLoyaltyDiscount,
          productDetails: null,
        })
      );

      return {
        order: order as OrderData,
        user: null,
        productsDetails: baseProductsDetails,
      };
    }
  };

  const handleExportToExcel = async () => {
    try {
      const fullData = await loadFullOrderData();
      const excelBuffer = generateOrderExcel(fullData);
      const fileName = `Заказ_${order.orderNumber}_${new Date().toISOString().split("T")[0]}`;

      downloadExcel(excelBuffer, fileName);
    } catch (error) {
      console.error("Ошибка генерации Excel:", error);
      alert("Ошибка при создании Excel файла");
    }
  };

  return (
    <>
      {/* Заголовок заказа - древовидная структура */}
      <div className="flex flex-1 flex-wrap justify-between items-start text-main-text gap-20">
        {/* Левая часть: номер заказа + аватар + имя */}
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

        {/* Правая часть: телефон + статус + кнопки */}
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

          {/* StatusDropdown */}
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

      {/* Детали заказа */}
      {showOrderDetails && (
        <div className="space-y-4">
          {/* Кнопки управления */}
          <div className="flex justify-center gap-3">
            <button
              className="bg-green-500 hover:bg-green-600 text-white w-50 h-10 px-2 flex justify-center items-center gap-2 rounded duration-300 cursor-pointer"
              onClick={handleExportToExcel}
            >
              <span>📊 Скачать Excel</span>
            </button>
            <button
              className="bg-[#f3f2f1] hover:shadow-button-secondary w-50 h-10 px-2 flex justify-center items-center gap-2 rounded duration-300 cursor-pointer"
              onClick={handleHideOrder}
            >
              <IconVision showPassword={true} />
              Скрыть заказ
            </button>
          </div>

          {/* Продукты заказа */}
          <OrderProductsLoader orderItems={order.items} />
        </div>
      )}
    </>
  );
};

export default AdminOrderCard;
