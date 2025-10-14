import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { additionalStyles, labelStyles, selectStyles } from "./styles";
import { formStyles } from "@/app/styles";
import { Schedule } from "@/types/deliverySchedule";
import { getThreeDaysDates } from "@/app/(admin)/administrator/delivery-times/utils/getThreeDaysDates";
import DeliveryTimeSkeletons from "./DeliveryTimeSkeletons";
import { formatTimeSlot } from "../utils/formatTimeSlot";
import { isTimeSlotPassed } from "../utils/isTimeSlotPassed";

interface DeliveryTimeProps {
  selectedDate: string;
  selectedTimeSlot: string;
  onDateChange: (date: string) => void;
  onTimeSlotChange: (timeSlot: string) => void;
}

const DeliveryTime = ({
  selectedDate,
  selectedTimeSlot,
  onDateChange,
  onTimeSlotChange,
}: DeliveryTimeProps) => {
  const [availableDates, setAvailableDates] = useState<
    { value: string; label: string }[]
  >([]);
  const [tooltipSlot, setTooltipSlot] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<Schedule>({});
  const [loading, setLoading] = useState(true);

  // Загрузка графика доставки
  useEffect(() => {
    const fetchDeliveryTimes = async () => {
      try {
        const response = await fetch("/api/delivery-times");
        const data = await response.json();

        if (data.schedule) {
          setSchedule(data.schedule);
        }
      } catch (error) {
        console.error("Ошибка загрузки графика доставки:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryTimes();
  }, []);

  // Генерация доступных дат
  useEffect(() => {
    const dates = getThreeDaysDates().map((dateString) => {
      const [year, month, day] = dateString.split("-");
      const formattedDate = `${day}.${month}.${year}`;

      return {
        value: dateString,
        label: formattedDate,
      };
    });

    setAvailableDates(dates);

    if (!selectedDate && dates.length > 0) {
      onDateChange(dates[0].value);
    }
  }, [selectedDate, onDateChange]);

  // Получение всех временных слотов для выбранной даты (свободных и занятых)
  const getAllTimeSlots = () => {
    if (!schedule[selectedDate]) return [];

    const daySchedule = schedule[selectedDate];
    const slots = Object.keys(daySchedule)
      .sort((a, b) => {
        // Сортировка по времени начала
        const [startA] = a.split("-");
        const [startB] = b.split("-");
        return startA.localeCompare(startB);
      })
      .map((slot) => {
        const formatted = formatTimeSlot(slot);
        const isFree = daySchedule[slot] !== false;
        const isPassed = isTimeSlotPassed(slot, selectedDate);
        const isAvailable = isFree && !isPassed;

        return {
          value: slot,
          mobileLabel: formatted.mobileLabel,
          desktopLabel: formatted.desktopLabel,
          free: isAvailable,
          passed: isPassed,
        };
      });
    return slots;
  };

  const handleTimeSlotClick = (slot: {
    value: string;
    free: boolean;
    passed?: boolean;
  }) => {
    if (slot.free && !slot.passed) {
      onTimeSlotChange(slot.value);
    }
  };

  const timeSlots = getAllTimeSlots();

  if (loading) {
    return <DeliveryTimeSkeletons />;
  }

  return (
    <div>
      <h2 className="text-2xl xl:text-4xl font-bold mb-6">Когда</h2>
      <div className="relative flex flex-col gap-y-4 md:flex-row md:flex-nowrap md:gap-x-8 xl:gap-x-10">
        <div>
          <label className={`${labelStyles} text-sm xl:text-base`}>Дата</label>
          <select
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className={`${formStyles.input} ${additionalStyles} ${selectStyles} [&&]:md:w-[155px] [&&]:text-base`}
          >
            {availableDates.map((date) => (
              <option key={date.value} value={date.value}>
                {date.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col w-full">
          <label className={`${labelStyles} text-sm xl:text-base`}>Время</label>
          {timeSlots.length === 0 ? (
            <div className="text-center bg-[#ffc7c7] py-2 text-[#d80000] rounded">
              На выбранную дату нет доставки
            </div>
          ) : (
            <div className="text-base grid grid-cols-3 xl:grid-cols-4 gap-2 w-full">
              {timeSlots.map((slot) => (
                <div
                  key={slot.value}
                  className="relative"
                  onMouseEnter={() =>
                    (!slot.free || slot.passed) && setTooltipSlot(slot.value)
                  }
                  onMouseLeave={() => setTooltipSlot(null)}
                  onTouchStart={() =>
                    (!slot.free || slot.passed) && setTooltipSlot(slot.value)
                  }
                  onTouchEnd={() => setTooltipSlot(null)}
                >
                  <button
                    type="button"
                    onClick={() => handleTimeSlotClick(slot)}
                    className={`p-2 rounded justify-center items-center w-full h-10 duration-300 ${
                      selectedTimeSlot === slot.value &&
                      slot.free &&
                      !slot.passed
                        ? "bg-primary text-white hover:shadow-button-default active:shadow-button-active"
                        : slot.free && !slot.passed
                          ? "bg-[#f3f2f1] hover:shadow-button-secondary cursor-pointer"
                          : "bg-white opacity-50 cursor-not-allowed"
                    }`}
                    disabled={!slot.free || slot.passed}
                  >
                    {/* Мобильная версия - скрыта на xl и выше */}
                    <span className="xl:hidden text-sm">
                      {slot.mobileLabel}
                    </span>

                    {/* Десктоп версия - показывается на xl и выше */}
                    <span className="hidden xl:block text-base">
                      {slot.desktopLabel}
                    </span>
                  </button>

                  {/* Тултип для занятых или прошедших слотов */}
                  {(!slot.free || slot.passed) &&
                    tooltipSlot === slot.value && (
                      <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2">
                        <div className="bg-[#f4f6fb] text-[#151515] text-sm rounded-[5px] p-2 flex items-center gap-2 whitespace-nowrap shadow-lg">
                          <Clock size={16} />
                          {slot.passed
                            ? "Это время уже прошло"
                            : "На это время доставить не можем"}
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-[#f4f6fb]"></div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryTime;
