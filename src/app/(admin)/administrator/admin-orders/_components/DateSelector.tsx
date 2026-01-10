import Image from "next/image";
import { Order } from "@/types/order";
import DateFilterButtons from "./DateFilterButtons";
import Calendar from "./Calendar";
import { useEffect, useState } from "react";

interface DateSelectorProps {
  customDate: Date | undefined;
  selectedDate: string;
  dates: string[];
  orders: Order[];
  onDateSelect: (date: string) => void;
  isCalendarOpen: boolean;
  toggleCalendar: () => void;
  onCalendarDateSelect: (date: Date | undefined) => void;
}

const DateSelector = ({
  customDate,
  selectedDate,
  dates,
  orders,
  onDateSelect,
  isCalendarOpen,
  toggleCalendar,
  onCalendarDateSelect,
}: DateSelectorProps) => {
  const [calendarMonth, setCalendarMonth] = useState<Date | undefined>(
    customDate || new Date()
  );

  useEffect(() => {
    if (customDate) {
      setCalendarMonth(customDate);
    }
  }, [customDate]);


  const handleDateSelect = (date: Date | undefined) => {
    onCalendarDateSelect(date);
    if (date) {
      setCalendarMonth(date);
    }
  };

  return (
    <div className="flex justify-start items-center gap-3 relative mb-15">
      <button
        type="button"
        onClick={toggleCalendar}
        className="relative hover:opacity-70 transition-opacity rounded w-15 h-15 bg-[#f3f2f1] flex justify-center items-center cursor-pointer"
      >
        <Image
          src="/icons-auth/icon-date.svg"
          alt="Календарь"
          width={24}
          height={24}
        />
      </button>
      {customDate && (
        <span className="absolute top-0 text-xs text-main-text">
          {customDate.toLocaleDateString("ru-RU")}
        </span>
      )}
      {isCalendarOpen && (
        <Calendar
          customDate={customDate}
          onDateSelect={handleDateSelect}
          month={calendarMonth}
        />
      )}
      <DateFilterButtons
        dates={dates}
        orders={orders}
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
      />
    </div>
  );
};

export default DateSelector;
