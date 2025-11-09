import { Order } from "@/types/order";
import {
  CustomCartItem,
  CustomPricing,
  DeliveryData,
} from "@/types/cart";
import { PriceComparison, ProductsData } from "@/types/userOrder";
import CartSummary from "@/app/(cart)/cart/_components/CartSummary";
import { PriceComparisonAlert } from "./PriceComparisonAlert";
import { PricePreservedAlert } from "./PricePreservedAlert";
import { DeliveryInfo } from "./DeliveryInfo";

interface RepeatOrderSectionProps {
  selectedDelivery: DeliveryData | null;
  isRepeatOrderCreated: boolean;
  canCreateRepeatOrder: boolean;
  priceComparison: PriceComparison | null;
  showPriceWarning: boolean;
  onClosePriceWarning: () => void;
  order: Order;
  deliveryData: DeliveryData | null;
  productsData: ProductsData;
  cartItemsForSummary: CustomCartItem[];
  customPricing: CustomPricing;
  hasLoyaltyCard: boolean;
  onOrderSuccess: () => void;
  onEditDelivery: () => void;
}

const RepeatOrderSection: React.FC<RepeatOrderSectionProps> = ({
  selectedDelivery,
  isRepeatOrderCreated,
  canCreateRepeatOrder,
  priceComparison,
  showPriceWarning,
  onClosePriceWarning,
  order,
  deliveryData,
  productsData,
  cartItemsForSummary,
  customPricing,
  hasLoyaltyCard,
  onOrderSuccess,
  onEditDelivery,
}) => {
  if (!selectedDelivery || isRepeatOrderCreated || !canCreateRepeatOrder) {
    return null;
  }

  return (
    <div className="mt-6 p-6 rounded bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">
        Оформление повторного заказа
      </h3>

      {showPriceWarning && priceComparison?.hasChanges && (
        <PriceComparisonAlert
          priceComparison={priceComparison}
          onClose={onClosePriceWarning}
        />
      )}

      {priceComparison && !priceComparison.hasChanges && (
        <PricePreservedAlert orderTotal={order.totalAmount} />
      )}

      {deliveryData && (
        <DeliveryInfo delivery={deliveryData} onEdit={onEditDelivery} />
      )}

      <CartSummary
        deliveryData={deliveryData}
        productsData={productsData}
        customCartItems={cartItemsForSummary}
        customPricing={customPricing}
        hasLoyaltyCard={hasLoyaltyCard}
        isRepeatOrder={true}
        onOrderSuccess={onOrderSuccess}
      />
    </div>
  );
};

export default RepeatOrderSection;
