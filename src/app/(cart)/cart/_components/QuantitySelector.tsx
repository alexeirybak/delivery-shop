import { memo } from "react";

interface QuantitySelectorProps {
  quantity: number;
  isUpdating: boolean;
  isOutOfStock: boolean;
  onDecrement: () => void;
  onIncrement: () => void;
  onProductCard?: boolean;
}

const QuantitySelector = memo(function QuantitySelector({
  quantity,
  isUpdating,
  isOutOfStock,
  onDecrement,
  onIncrement,
  onProductCard,
}: QuantitySelectorProps) {
  return (
    <div
      className={`flex items-center bg-primary p-2 rounded text-white relative h-10 gap-2 ${
        onProductCard ? " w-full justify-between" : "w-25"
      }`}
    >
      <button
        onClick={onDecrement}
        disabled={quantity < 0 || isUpdating || isOutOfStock}
        className="flex items-center justify-center w-6 h-6 rounded cursor-pointer transition-custom disabled:opacity-50"
      >
        <div className="w-[15px] h-px bg-white"></div>
      </button>

      <span className="w-12 text-base text-center">
        {isUpdating ? "..." : quantity}
      </span>

      <button
        onClick={onIncrement}
        disabled={isUpdating || isOutOfStock}
        className="flex items-center justify-center w-6 h-6 rounded cursor-pointer transition-custom disabled:opacity-50"
      >
        <div className="relative w-[15px] h-[15px]">
          <div className="absolute left-0 w-full h-px transform -translate-y-1/2 bg-white top-1/2"></div>
          <div className="absolute top-0 w-px h-full transform -translate-x-1/2 bg-white left-1/2"></div>
        </div>
      </button>
    </div>
  );
});

export default QuantitySelector;
