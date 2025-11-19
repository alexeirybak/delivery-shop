import Image from "next/image";
import { Order } from "@/types/order";
import DateFilterButtons from "./DateFilterButtons";
import Calendar from "./Calendar";

interface DateSelectorProps {
  customDate: Date | undefined;
  isCalendarOpen: boolean;
  toggleCalendar: () => void;
  selectedDate: string;
  dates: string[];
  orders: Order[];
  onDateSelect: (date: string) => void;
  onCalendarDateSelect: (date: Date | undefined) => void;
}

const DateSelector = ({
  customDate,
  isCalendarOpen,
  toggleCalendar,
  selectedDate,
  dates,
  orders,
  onDateSelect,
  onCalendarDateSelect,
}: DateSelectorProps) => {
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
        {/* Показываем выбранную дату если она есть */}
        {customDate && (
          <span className="absolute top-0 text-xs text-main-text">
            {customDate.toLocaleDateString("ru-RU")}
          </span>
        )}
      </button>

      {isCalendarOpen && (
        <Calendar
          customDate={customDate}
          onDateSelect={onCalendarDateSelect}
          onMonthChange={onCalendarDateSelect}
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
