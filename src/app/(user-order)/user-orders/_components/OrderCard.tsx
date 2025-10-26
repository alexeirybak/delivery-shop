import Image from "next/image";
import { Order } from "@/types/order";
import {
  formatOrderDate,
  getStatusColor,
  getStatusText,
} from "./utils/dateUtils";
import ProductsSection from "@/components/ProductsSection";
import { useEffect, useState } from "react";
import { ProductCardProps } from "@/types/product";
import MiniLoader from "@/components/MiniLoader";
import { buttonStyles } from "@/app/styles";
import { isTimeSlotPassed } from "@/app/(cart)/cart/utils/isTimeSlotPassed";
import IconVision from "@/components/svg/IconVision";
import { getThreeDaysDates } from "@/app/(admin)/administrator/delivery-times/utils/getThreeDaysDates";

interface DeliverySchedule {
  [date: string]: {
    [timeSlot: string]: boolean;
  };
}

interface DeliveryTimes {
  schedule: DeliverySchedule;
  updatedAt: string;
}

const OrderCard = ({ order }: { order: Order }) => {
  const [orderProducts, setOrderProducts] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeliveryButton, setShowDeliveryButton] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [deliverySchedule, setDeliverySchedule] = useState<DeliverySchedule>(
    {}
  );
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const displayedProducts = showOrderDetails
    ? orderProducts
    : orderProducts.slice(0, 4);

  useEffect(() => {
    const fetchDeliverySchedule = async () => {
      try {
        const response = await fetch("/api/delivery-times");
        if (response.ok) {
          const data: DeliveryTimes = await response.json();
          setDeliverySchedule(data.schedule || {});
        }
      } catch (error) {
        console.error("Ошибка загрузки расписания доставки:", error);
      }
    };

    fetchDeliverySchedule();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const promises = order.items.map(async (item) => {
          try {
            const response = await fetch(`/api/products/${item.productId}`);
            if (!response.ok)
              throw new Error(`Товар ${item.productId} не найден`);

            const productData = await response.json();

            return {
              _id: productData._id,
              id: productData.id,
              img: productData.img,
              title: productData.title,
              description: productData.description,
              basePrice: productData.basePrice,
              discountPercent: productData.discountPercent,
              rating: productData.rating,
              quantity: item.quantity,
            } as ProductCardProps;
          } catch (error) {
            console.error(`Ошибка загрузки товара ${item.productId}:`, error);
            return null;
          }
        });

        const results = await Promise.all(promises);
        const validProducts = results.filter(
          (product): product is ProductCardProps => product !== null
        );
        setOrderProducts(validProducts);
      } catch (error) {
        console.error("Ошибка загрузки товаров:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [order]);

  // Получаем доступные временные интервалы для выбранной даты
  const getAvailableTimeSlots = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    const daySchedule = deliverySchedule[dateString];

    if (!daySchedule) {
      return [];
    }

    const availableSlots = Object.entries(daySchedule)
      .filter(([timeSlot, available]) => {
        if (!available) return false;

        const isPassed = isTimeSlotPassed(timeSlot, dateString);
        return !isPassed;
      })
      .map(([timeSlot]) => timeSlot)
      .sort();

    return availableSlots;
  };

  // Получаем 3 ближайших доступных дня через getThreeDaysDates
  const getAvailableDates = () => {
    const threeDaysDates = getThreeDaysDates();

    return threeDaysDates
      .map((dateString) => {
        const daySchedule = deliverySchedule[dateString];

        if (!daySchedule) {
          return null;
        }

        const totalSlots = Object.values(daySchedule).filter(
          (available) => available
        ).length;

        // Для списка дат считаем ВСЕ слоты из расписания
        // Временные ограничения будут применены при выборе времени
        return {
          date: new Date(dateString),
          dateString,
          availableSlots: totalSlots,
          totalSlots,
        };
      })
      .filter(Boolean); // Убираем null значения
  };

  const handleOrderClick = () => {
    setShowDeliveryButton(true);
  };

  const handleDeliveryClick = () => {
    setShowDatePicker(true);

    const availableDates = getAvailableDates();

    if (availableDates.length > 0) {
      setSelectedDate(availableDates[0]!.date);
    } else {
      setSelectedDate(null);
    }
  };

  const createRepeatOrder = async (date: Date, timeSlot: string) => {
    try {
      setIsCreatingOrder(true);

      const newOrderData = {
        paymentMethod: order.paymentMethod,
        deliveryAddress: order.deliveryAddress,
        deliveryTime: {
          date: date.toISOString().split("T")[0],
          timeSlot: timeSlot,
        },
        cartItems: order.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          discountPercent: item.discountPercent,
          hasLoyaltyDiscount: item.hasLoyaltyDiscount,
        })),
        usedBonuses: 0,
        totalBonuses: order.earnedBonuses,
        finalPrice: order.totalAmount,
        totalDiscount: order.discountAmount,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrderData),
      });

      if (!response.ok) {
        throw new Error("Ошибка создания заказа");
      }

      const result = await response.json();

      setShowDatePicker(false);
      setShowDeliveryButton(false);
      setSelectedDate(null);

      alert(`Заказ успешно создан! Номер заказа: ${result.orderNumber}`);
      window.location.reload();
    } catch (error) {
      console.error("Ошибка создания повторного заказа:", error);
      alert("Произошла ошибка при создании заказа");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    if (selectedDate) {
      createRepeatOrder(selectedDate, timeSlot);
    }
  };

  // Форматируем дату для отображения
  const formatDisplayDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Сегодня";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Завтра";
    } else {
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
      });
    }
  };

  if (loading) {
    return <MiniLoader />;
  }

  return (
    <div className="text-main-text">
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
          <p className="text-2xl">
            {order.totalAmount.toLocaleString("ru-RU")} ₽
          </p>
          {!showDeliveryButton ? (
            <button
              className={`${buttonStyles.active} w-50 h-10 cursor-pointer`}
              onClick={handleOrderClick}
            >
              Заказать
            </button>
          ) : (
            <button
              className="bg-primary text-white flex justify-between items-center border-none rounded cursor-pointer duration-300 hover:shadow-button-default w-50 h-10 p-2"
              onClick={handleDeliveryClick}
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

      <ProductsSection products={displayedProducts} applyIndexStyles={true} />

      <div className="flex justify-center mt-10">
        <button
          className="bg-[#f3f2f1] hover:shadow-button-secondary w-50 h-10 px-2 flex justify-center items-center gap-2 rounded duration-300 cursor-pointer "
          onClick={() => setShowOrderDetails(!showOrderDetails)}
        >
          <IconVision showPassword={!showOrderDetails} />
          {showOrderDetails ? "Скрыть заказ" : "Просмотреть заказ"}
        </button>
      </div>

      {showOrderDetails && (
        <>
          <div className="mb-4 grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-3 lg:gap-6 text-sm mt-10">
            <p className="text-gray-600 lg:text-base">Адрес доставки:</p>
            <p className="font-medium lg:text-base break-words">
              {order.deliveryAddress.city}, {order.deliveryAddress.street},{" "}
              {order.deliveryAddress.house}
              {order.deliveryAddress.apartment &&
                `, кв. ${order.deliveryAddress.apartment}`}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 lg:text-base">Скидка:</span>
              <span className="font-medium lg:text-base text-red-600">
                -{order.discountAmount.toLocaleString("ru-RU")} ₽
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 lg:text-base">
                Использовано бонусов:
              </span>
              <span className="font-medium lg:text-base">
                {order.usedBonuses.toLocaleString("ru-RU")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 lg:text-base">
                Начислено бонусов:
              </span>
              <span className="font-medium lg:text-base text-green-600">
                +{order.earnedBonuses.toLocaleString("ru-RU")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 lg:text-base">Способ оплаты:</span>
              <span className="font-medium lg:text-base">
                {order.paymentMethod === "online" ? "Онлайн" : "При получении"}
              </span>
            </div>
          </div>
        </>
      )}

      {showDatePicker && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">
              Выберите дату и время доставки
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Дата доставки:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {getAvailableDates().map((item) => (
                  <button
                    key={item!.dateString}
                    onClick={() => handleDateSelect(item!.date)}
                    className={`py-2 px-3 rounded text-sm duration-300 cursor-pointer ${
                      selectedDate?.toDateString() === item!.date.toDateString()
                        ? "bg-primary text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    <div>{formatDisplayDate(item!.date)}</div>
                  </button>
                ))}
              </div>
            </div>

            {selectedDate && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Доступное время доставки для {formatDisplayDate(selectedDate)}
                  :
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {getAvailableTimeSlots(selectedDate).map((slot) => (
                    <button
                      key={slot}
                      onClick={() => handleTimeSlotSelect(slot)}
                      disabled={isCreatingOrder}
                      className="bg-gray-100 hover:bg-primary hover:text-white py-2 px-3 rounded text-sm duration-300 cursor-pointer disabled:opacity-50"
                    >
                      {slot}
                    </button>
                  ))}
                  {getAvailableTimeSlots(selectedDate).length === 0 && (
                    <p className="col-span-2 text-center text-gray-500 py-2">
                      Нет доступных временных интервалов
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setShowDatePicker(false);
                  setSelectedDate(null);
                  setShowDeliveryButton(false);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 hover:text-white duration-300 cursor-pointer"
                disabled={isCreatingOrder}
              >
                Отмена
              </button>
            </div>

            {isCreatingOrder && (
              <div className="mt-4 text-center">
                <MiniLoader />
                <p className="text-sm text-gray-600">Создаем заказ...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
