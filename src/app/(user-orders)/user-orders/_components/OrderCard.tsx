import { useOrderProducts } from "@/hooks/useOrderProducts";
import { Order } from "@/types/order";
import OrderHeader from "./OrderHeader";
import { useDeliveryData } from "@/hooks/useDeliveryData";
import useRepeatOrder from "@/hooks/useRepeatOrder";
import DeliveryDatePicker from "./DeliveryDatePicker";

const OrderCard = ({ order }: { order: Order }) => {
  const {
    showDatePicker,
    showDeliveryButton,
    handleOrderClick,
    handleDeliveryClick,
    handleDateSelect,
    handleCancelDelivery
  } = useRepeatOrder();
  const {
    orderProducts,
    loading: productsLoading,
    stockWarnings,
  } = useOrderProducts(order);

  const { deliverySchedule } = useDeliveryData();

  return (
    <div className="text-main-text">
      <OrderHeader
        order={order}
        showDeliveryButton={showDeliveryButton}
        onOrderClick={handleOrderClick}
        onDeliveryClick={handleDeliveryClick}
      />
      {showDatePicker && (
        <DeliveryDatePicker
          schedule={deliverySchedule}
          isCreatingOrder={false}
          onDateSelect={(date, timeSlot) =>
            handleDateSelect(date, timeSlot, order.deliveryAddress)
          }
          onCancel={handleCancelDelivery}
        />
      )}
    </div>
  );
};

export default OrderCard;
