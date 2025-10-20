import { buttonStyles } from "@/app/styles";

interface CheckoutButtonProps {
  isCheckout: boolean;
  isMinimumReached: boolean;
  visibleCartItemsCount: number;
  onCheckout: () => void;
}

export const CheckoutButton = ({
  isCheckout,
  isMinimumReached,
  visibleCartItemsCount,
  onCheckout,
}: CheckoutButtonProps) => {
  if (isCheckout) return null;
  return (
    <button
      onClick={onCheckout}
      disabled={!isMinimumReached || visibleCartItemsCount === 0}
      className={`p-3 rounded mx-auto w-full text-2xl cursor-pointer ${
        isMinimumReached && visibleCartItemsCount > 0
          ? buttonStyles.active
          : buttonStyles.inactive
      }`}
    >
      Оформить заказ
    </button>
  );
};

export default CheckoutButton;
