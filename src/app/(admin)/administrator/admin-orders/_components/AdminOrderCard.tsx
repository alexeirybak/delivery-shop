import { Order } from "@/types/order";
import OrderProductsLoader from "./OrderProductsLoader";
import { useState } from "react";
import { updateOrderStatus } from "@/app/(cart)/cart/utils/orderHelpers";
import { getMappedStatus } from "../utils/getMappedStatus";
import { getEnglishStatus } from "../utils/getEnglishStatus";
import OrderHeader from "./OrderHeader";
import StatusDropdown from "./StatusDropdown";
import UserAvatar from "./UserAvatar";
import IconVision from "@/components/svg/IconVision";
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

  // В AdminOrderCard добавьте вызов onStatusUpdate при изменении статуса
  const handleStatusChange = async (newStatusLabel: string) => {
    setIsUpdating(true);
    try {
      const englishStatus = getEnglishStatus(newStatusLabel);
      await updateOrderStatus(order._id, { status: englishStatus });

      setCurrentStatusLabel(newStatusLabel);

      // ВАЖНО: вызываем callback для обновления в родительском компоненте
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

      // Создаем базовые данные с правильными типами
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
      <OrderHeader
        orderNumber={order.orderNumber}
        phone={order.phone}
        statusDropdown={
          <StatusDropdown
            currentStatusLabel={currentStatusLabel}
            isUpdating={isUpdating}
            onStatusChange={handleStatusChange}
          />
        }
        viewButton={
          showOrderDetails ? (
            <button
              className="bg-green-500 hover:bg-green-600 text-white w-50 h-10 px-2 flex justify-center items-center gap-2 rounded duration-300 cursor-pointer"
              onClick={handleExportToExcel}
            >
              <span>📊 Скачать Excel</span>
            </button>
          ) : (
            <button
              className="bg-[#f3f2f1] hover:shadow-button-secondary w-50 h-10 px-2 flex justify-center items-center gap-2 rounded duration-300 cursor-pointer"
              onClick={handleToggleDetails}
            >
              <IconVision showPassword={!showOrderDetails} />
              {showOrderDetails ? "Скрыть заказ" : "Просмотреть заказ"}
            </button>
          )
        }
      >
        <div className="flex items-center gap-x-2">
          <UserAvatar
            userId={order.userId}
            gender={order.gender}
            name={order.name}
          />
          <span className="text-base md:text-lg">{order.name}</span>
        </div>
      </OrderHeader>

      {showOrderDetails && (
        <>
          <OrderProductsLoader orderItems={order.items} />
          <div className="flex justify-center mt-6">
            <button
              className="bg-[#f3f2f1] hover:shadow-button-secondary w-50 h-10 px-2 flex justify-center items-center gap-2 rounded duration-300 cursor-pointer"
              onClick={handleHideOrder}
            >
              <IconVision showPassword={true} />
              Скрыть заказ
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default AdminOrderCard;
