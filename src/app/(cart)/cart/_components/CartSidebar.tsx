import { CartSidebarProps } from "@/types/cart";
import BonusesSection from "./BonusesSection";
import CartSummary from "./CartSummary";

const CartSidebar = ({
  bonusesCount,
  useBonuses,
  onUseBonusesChange,
  totalPrice,
  visibleCartItems,
  totalMaxPrice,
  totalDiscount,
  finalPrice,
  totalBonuses,
  isMinimumReached,
  onCheckout,
  isCheckout = false,
}: CartSidebarProps) => {
  return (
    <div className="flex flex-col gap-y-6 md:w-[255px] xl:w-[272px]">
      <BonusesSection
        bonusesCount={bonusesCount}
        useBonuses={useBonuses}
        onUseBonusesChange={onUseBonusesChange}
        totalPrice={totalPrice}
      />

      <CartSummary
        visibleCartItems={visibleCartItems}
        totalMaxPrice={totalMaxPrice}
        totalDiscount={totalDiscount}
        finalPrice={finalPrice}
        totalBonuses={totalBonuses}
        isMinimumReached={isMinimumReached}
        onCheckout={onCheckout}
        isCheckout={isCheckout} 
      />
    </div>
  );
};

export default CartSidebar;