import { FC } from "react";

const ProductSkeletons: FC<{ count?: number; applyIndexStyles: boolean }> = ({
  count = 4,
  applyIndexStyles = true,
}) => {
  return (
    <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-10 justify-items-center">
      {[...Array(count)].map((_, index) => (
        <li
          key={`skeleton-${index}`}
          className={`
            w-full aspect-[1/1.3] bg-gray-100 animate-pulse rounded-lg
            ${applyIndexStyles ? (index >= 3 ? "md:hidden xl:block" : "") : ""}
          `}
        />
      ))}
    </ul>
  );
};

export default ProductSkeletons;
