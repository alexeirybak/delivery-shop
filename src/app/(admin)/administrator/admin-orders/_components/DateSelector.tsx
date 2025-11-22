import { Order } from "@/types/order";
import DateFilterButtons from "./DateFilterButtons";

interface DateSelectorProps {
  customDate: Date | undefined;
  selectedDate: string;
  dates: string[];
  orders: Order[];
  onDateSelect: (date: Date | undefined) => void;
}

const DateSelector = ({
  customDate,
  selectedDate,
  dates,
  orders,
  onDateSelect,
}: DateSelectorProps) => {
  return (
    <div className="flex justify-start items-center gap-3 relative mb-15">
      <button>Кнопка календаря</button>
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
