import IconVision from "@/components/svg/IconVision";

interface OrderActionsProps {
  showOrderDetails: boolean;
  onToggleDetails: () => void;
}

export const OrderActions: React.FC<OrderActionsProps> = ({
  showOrderDetails,
  onToggleDetails,
}) => {
  return (
    <div className="flex justify-center mt-10">
      <button
        className="bg-[#f3f2f1] hover:shadow-button-secondary w-50 h-10 px-2 flex justify-center items-center gap-2 rounded duration-300 cursor-pointer"
        onClick={onToggleDetails}
      >
        <IconVision showPassword={!showOrderDetails} />
        {showOrderDetails ? "Скрыть заказ" : "Просмотреть заказ"}
      </button>
    </div>
  );
};