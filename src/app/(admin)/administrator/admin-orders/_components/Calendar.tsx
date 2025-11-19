import { DayPicker } from "react-day-picker";
import { ru } from "date-fns/locale";
import "react-day-picker/style.css";
import "../daypicker.css";
import Image from "next/image";

interface CalendarProps {
  customDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onMonthChange: (date: Date | undefined) => void;
}

const Calendar = ({ customDate, onDateSelect, onMonthChange }: CalendarProps) => {
  const getMonthName = (date: Date) => {
    const monthName = date.toLocaleDateString("ru-RU", {
      month: "long",
    });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    const year = date.getFullYear();
    return `${capitalizedMonth} ${year}`;
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(customDate || new Date());
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(customDate || new Date());
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  return (
    <div className="absolute top-17 left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80">
      {/* Кастомная навигация */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-bold text-main-text">
          {customDate ? getMonthName(customDate) : "Выберите дату"}
        </span>
        <div className="flex gap-x-4 justify-center">
          <button
            onClick={handlePreviousMonth}
            className="p-2 bg-[#f3f2f1] hover:bg-primary rounded duration-300 cursor-pointer"
          >
            <Image
              src="/icons-header/icon-arrow-right.svg"
              width={24}
              height={24}
              alt="Предыдущий месяц"
              className="rotate-180"
            />
          </button>

          <button
            onClick={handleNextMonth}
            className="p-2 bg-[#f3f2f1] hover:bg-primary rounded duration-300 cursor-pointer"
          >
            <Image
              src="/icons-header/icon-arrow-right.svg"
              width={24}
              height={24}
              alt="Следующий месяц"
            />
          </button>
        </div>
      </div>

      <DayPicker
        mode="single"
        selected={customDate}
        onSelect={onDateSelect}
        locale={ru}
        showOutsideDays={true}
        className="p-0"
        classNames={{
          root: "w-full",
          month: "w-full",
          caption: "hidden",
          nav: "hidden",
          table: "w-full border-collapse",
          head_row: "border-b",
          head_cell: "font-normal py-2 text-sm",
          row: "border-b",
          cell: "h-10 text-center",
          day: "size-10 rounded-full text-[#606060] hover:text-white hover:bg-[#ff6633] duration-300 cursor-pointer mx-auto",
          day_selected: "bg-[#ff6633] !text-white",
          day_today: "bg-gray-100 !text-white",
          day_outside: "text-gray-500 opacity-50",
        }}
        modifiersStyles={{
          selected: {
            color: "white",
            backgroundColor: "#ff6633",
            border: "none",
          },
          today: {
            color: "white",
            backgroundColor: "#ff6633",
            border: "none",
          },
        }}
      />
    </div>
  );
};

export default Calendar;