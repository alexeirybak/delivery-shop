import Image from "next/image";
import { getAvailableTimeSlots } from "../../../../../../utils/getAvailableTimeSlots";
import { useGetAdminOrdersQuery } from "@/store/redux/api/ordersApi";
import { Schedule } from "@/types/deliverySchedule";
import { useEffect, useState } from "react";
import { formatDateToLocalYYYYMMDD } from "../../../../../../utils/formatDateToLocalYYYYMMDD";
import { buttonStyles } from "@/app/styles";
import { formatDeliveryDateTime } from "../utils/formatDeliveryDateTime";
import Calendar from "./Calendar";

interface CalendarModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ScheduleData {
  schedule: Schedule;
}

const CalendarOrderModal = ({
  orderId,
  isOpen,
  onClose,
}: CalendarModalProps) => {
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const { data } = useGetAdminOrdersQuery();
  const order = data?.orders?.find((o) => o._id === orderId);

  useEffect(() => {
    const fetchDeliveryTimes = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/delivery-times");
        const data: ScheduleData = await response.json();
        setScheduleData(data);
      } catch (error) {
        console.error("Ошибка загрузки графика доставки:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchDeliveryTimes();
    }
  }, [isOpen]);

  useEffect(() => {
    if (order?.deliveryDate) {
      const orderDate = new Date(order.deliveryDate);
      setSelectedDate(orderDate);
      if (order.deliveryTimeSlot) {
        setSelectedTimeSlot(order.deliveryTimeSlot);
      }
    }
  }, [order?.deliveryDate, order?.deliveryTimeSlot]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setSelectedTimeSlot("");
    }
  };

  const availableTimeSlots =
    scheduleData?.schedule && selectedDate
      ? getAvailableTimeSlots(selectedDate, scheduleData.schedule)
      : [];

  const updateOrderDeliveryTime = async () => {
    if (!orderId || !selectedTimeSlot) {
      alert("Пожалуйста, выберите временной слот");
      return;
    }

    try {
      const formattedDate = formatDateToLocalYYYYMMDD(selectedDate);

      const response = await fetch(
        `/api/admin/orders/${orderId}/delivery-time`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            deliveryDate: formattedDate,
            deliveryTimeSlot: selectedTimeSlot,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        onClose();
      } else {
        alert(
          `Ошибка: ${result.message || "Не удалось обновить время доставки"}`
        );
      }
    } catch (error) {
      console.error("Ошибка при обновлении времени доставки:", error);
      alert("Произошла ошибка при обновлении времени доставки");
    }
  };

  if (!isOpen) return null;
  return (
    <div className="absolute right-0 z-50 mt-14">
      <div className="px-5 py-5 w-92 bg-white rounded shadow-button-secondary">
        <div className="flex justify-between items-center pb-6">
          <h4 className="text-lg text-main-text">Изменить время</h4>
          <button onClick={onClose} className="cursor-pointer hover:opacity-70">
            <Image
              src="/icons-auth/icon-closer.svg"
              alt="Закрыть"
              width={24}
              height={24}
            />
          </button>
        </div>

        <Calendar
          isOrderDateChange={true}
          customDate={selectedDate}
          onDateSelect={handleDateSelect}
        />

        {order && (
          <div className="p-5 text-main-text text-lg">
            {formatDeliveryDateTime(order.deliveryDate, order.deliveryTimeSlot)}
          </div>
        )}

        {loading ? (
          <div className="py-4 text-center text-main-text">
            Загрузка слотов доставки...
          </div>
        ) : scheduleData?.schedule ? (
          <>
            {availableTimeSlots.length > 0 ? (
              <>
                <div className="mt-4 mb-4">
                  <div className="grid grid-cols-2 gap-2">
                    {availableTimeSlots.map((slot) => {
                      const isSelected = selectedTimeSlot === slot;
                      const isOriginalOrderSlot =
                        order?.deliveryDate &&
                        order?.deliveryTimeSlot === slot &&
                        formatDateToLocalYYYYMMDD(
                          new Date(order.deliveryDate)
                        ) === formatDateToLocalYYYYMMDD(selectedDate);

                      const shouldHighlight =
                        isSelected ||
                        (isOriginalOrderSlot && !selectedTimeSlot);

                      return (
                        <button
                          key={slot}
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`py-2 px-3 rounded text-sm duration-300 cursor-pointer ${
                            shouldHighlight
                              ? "bg-primary text-white"
                              : "bg-gray-100 hover:bg-primary hover:text-white"
                          }`}
                        >
                          <span>
                            {slot.replace(".", ":").split("-")[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4">
                  <button
                    onClick={updateOrderDeliveryTime}
                    className={`flex-1 h-10 rounded cursor-pointer ${
                      selectedTimeSlot
                        ? `${buttonStyles.active}`
                        : `${buttonStyles.inactive}`
                    }`}
                  >
                    Подтвердить
                  </button>
                </div>
              </>
            ) : (
              <div className="py-4 text-center text-gray-500">
                На выбранную дату нет доступных временных слотов
              </div>
            )}
          </>
        ) : (
          <div className="py-4 text-center text-gray-500">
            Нет данных о графике доставки
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarOrderModal;
