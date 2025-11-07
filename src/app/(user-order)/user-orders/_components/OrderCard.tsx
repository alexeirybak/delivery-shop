import { Order } from "@/types/order";
import { useOrderProducts } from "@/hooks/useOrderProducts";
import { useDeliveryData } from "@/hooks/useDeliveryData";
import { usePriceComparison } from "@/hooks/usePriceComparison";
import { useRepeatOrder } from "@/hooks/useRepeatOrder";
import { useOrderPricing } from "@/hooks/useOrderPricing";
import ProductsSection from "@/components/ProductsSection";
import MiniLoader from "@/components/MiniLoader";
import OrderHeader from "./OrderHeader";
import OrderDetails from "./OrderDetails";
import DeliveryDatePicker from "./DeliveryDatePicker";
import { StockWarningsAlert } from "./StockWarningsAlert";
import { RepeatOrderSuccessAlert } from "./RepeatOrderSuccessAlert";
import { OrderActions } from "./OrderActions";
import { useEffect, useState } from "react";
import RepeatOrderSection from "./RepeatOrderSection";

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const { orderProducts, loading: productsLoading, stockWarnings } = useOrderProducts(order);
  const { deliverySchedule } = useDeliveryData();
  const { currentProducts, priceComparison, loading: loadingCurrentPrices } = usePriceComparison(order);
  const { cartItemsForSummary, productsData, customPricing, hasLoyaltyCard } = useOrderPricing(order, currentProducts, priceComparison);
  
  const {
    showDeliveryButton,
    showDatePicker,
    selectedDelivery,
    setSelectedDelivery, 
    isRepeatOrderCreated,
    handleOrderClick,
    handleDeliveryClick,
    handleDateSelect,
    handleCancelDelivery,
    handleRepeatOrderSuccess,
  } = useRepeatOrder();

  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showPriceWarning, setShowPriceWarning] = useState(false);

  const hasStockIssues = orderProducts.some(
    (product) => product.isLowStock || product.insufficientStock
  );
  const canCreateRepeatOrder = !hasStockIssues;
  const applyIndexStyles = !showOrderDetails;

  useEffect(() => {
    if (priceComparison?.hasChanges) {
      setShowPriceWarning(true);
    }
  }, [priceComparison]);

  if (productsLoading || loadingCurrentPrices) {
    return <MiniLoader />;
  }

  return (
    <div className="text-main-text">
      <OrderHeader
        order={order}
        showDeliveryButton={showDeliveryButton && !isRepeatOrderCreated}
        onOrderClick={handleOrderClick}
        onDeliveryClick={handleDeliveryClick}
        disabled={hasStockIssues}
      />

      <ProductsSection
        products={orderProducts}
        applyIndexStyles={applyIndexStyles}
        isOrderPage={true}
      />

      <RepeatOrderSection
        selectedDelivery={selectedDelivery}
        isRepeatOrderCreated={isRepeatOrderCreated}
        canCreateRepeatOrder={canCreateRepeatOrder}
        priceComparison={priceComparison}
        showPriceWarning={showPriceWarning}
        onClosePriceWarning={() => setShowPriceWarning(false)}
        order={order}
        deliveryData={selectedDelivery}
        productsData={productsData}
        cartItemsForSummary={cartItemsForSummary}
        customPricing={customPricing}
        hasLoyaltyCard={hasLoyaltyCard}
        onOrderSuccess={handleRepeatOrderSuccess}
        onEditDelivery={() => setSelectedDelivery(null)} 
      />

      <StockWarningsAlert warnings={stockWarnings} hasStockIssues={hasStockIssues} />

      {isRepeatOrderCreated && <RepeatOrderSuccessAlert />}

      <OrderActions
        showOrderDetails={showOrderDetails}
        onToggleDetails={() => setShowOrderDetails(!showOrderDetails)}
      />

      {showOrderDetails && <OrderDetails order={order} />}

      {showDatePicker && (
        <DeliveryDatePicker
          schedule={deliverySchedule}
          isCreatingOrder={false}
          onDateSelect={(date, timeSlot) => handleDateSelect(date, timeSlot, order.deliveryAddress)}
          onCancel={handleCancelDelivery}
        />
      )}
    </div>
  );
};

export default OrderCard;