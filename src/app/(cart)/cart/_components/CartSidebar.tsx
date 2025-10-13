import { CartSidebarProps } from "@/types/cart";
import BonusesSection from "./BonusesSection";
import CartSummary from "./CartSummary";

const CartSidebar = ({
  onCheckout,
  deliveryData,
  productsData,
}: CartSidebarProps) => {
  return (
    <div className="flex flex-col gap-y-6 md:w-[255px] xl:w-[272px]">
      <BonusesSection />
      <CartSummary
        onCheckout={onCheckout}
        deliveryData={deliveryData}
        productsData={productsData} 
      />
    </div>
  );
};

export default CartSidebar;
