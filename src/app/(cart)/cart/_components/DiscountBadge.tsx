import { memo } from "react";

interface DiscountBadgeProps {
  discountPercent: number;
}

const DiscountBadge = memo(function DiscountBadge({
  discountPercent,
}: DiscountBadgeProps) {
  return (
    <div className="bg-[#ff6633] rounded py-1 px-2 text-white flex justify-center items-center text-xs">
      -{discountPercent}%
    </div>
  );
});

export default DiscountBadge;
